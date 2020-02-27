import { useEffect, useState } from "react";

const useRecorder = () => {
  // Internal state
  const [shouldStartRecording, setShouldStartRecording] = useState(false);

  // Exported state
  const [audioURL, setAudioURL] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);

  useEffect(() => {
    // Lazily obtain recorder first time we're recording.
    if (recorder === null) {
      if (shouldStartRecording) {
        requestRecorder().then(setRecorder, e => {
          console.error(e);

          setShouldStartRecording(false);
        });
      }
      return;
    }

    // Manage recorder state.
    if (shouldStartRecording) {
      recorder.start();
      setIsRecordingAudio(true);
    } else {
      recorder.stop();
    }

    // Obtain the audio when ready.
    const handleData = e => {
      setAudioURL(URL.createObjectURL(e.data));
      setAudioBlob(e.data);
      setIsRecordingAudio(false);
    };

    recorder.addEventListener("dataavailable", handleData);

    return () => {
      recorder.stream.getTracks().forEach(i => i.stop());
      recorder.removeEventListener("dataavailable", handleData);
    };
  }, [recorder, shouldStartRecording]);

  const startRecording = () => {
    setShouldStartRecording(true);
  };

  const stopRecording = () => {
    setShouldStartRecording(false);
  };

  return [audioURL, audioBlob, isRecordingAudio, startRecording, stopRecording];
};

async function requestRecorder() {
  let stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  // const mimeType = "audio/ogg";
  const mimeType = "audio/mpeg";
  return new MediaRecorder(stream, { type: mimeType });
}
export default useRecorder;
