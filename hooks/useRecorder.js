import { useEffect, useState } from "react";
import MediaRecorder from "audio-recorder-polyfill";
MediaRecorder.encoder = require("audio-recorder-polyfill/mpeg-encoder");
MediaRecorder.prototype.mimeType = "audio/mpeg";

// type Hook = () => [string, any, boolean, () => void, () => void];

const useRecorder = () => {
  const [audioURL, setAudioURL] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);

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
    const handleData = e => {
      setAudioURL(URL.createObjectURL(e.data));
      setAudioBlob(e.data);
    };

    recorder.addEventListener("dataavailable", handleData);
    return () => {
      recorder.stream.getTracks().forEach(i => i.stop());
      recorder.removeEventListener("dataavailable", handleData);
    };
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
  // const mimeType = "audio/ogg";
  const mimeType = "audio/mpeg";
  return new MediaRecorder(stream, { type: mimeType });
}
export default useRecorder;
