import { useEffect, useState } from "react";

type Hook = () => [string, any, boolean, () => void, () => void];

const useRecorder: Hook = () => {
  const [audioURL, setAudioURL] = useState<string>("");
  const [audioBlob, setAudioBlob] = useState<any>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);

  useEffect(() => {
    // Lazily obtain recorder first time we're recording.
    if (recorder === null) {
      if (isRecording) {
        requestRecorder().then(setRecorder, e => {
          console.error(e);
          setIsRecording(false);
        });
      }
      return;
    }

    // Manage recorder state.
    if (isRecording) {
      recorder.start();
    } else {
      recorder.stop();
    }

    // Obtain the audio when ready.
    const handleData = (e: any) => {
      setAudioURL(URL.createObjectURL(e.data));
      setAudioBlob(e.data);
    };

    recorder.addEventListener("dataavailable", handleData);
    return () => recorder.removeEventListener("dataavailable", handleData);
  }, [recorder, isRecording]);

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  return [audioURL, audioBlob, isRecording, startRecording, stopRecording];
};

async function requestRecorder() {
  let stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  return new MediaRecorder(stream);
}
export default useRecorder;
