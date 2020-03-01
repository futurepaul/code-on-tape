import { useState, useRef, useCallback, useEffect } from "react";

export default function AudioRecorder({ onHasMediaUrl, onClickRecord }) {
  const [status, setStatus] = useState("");
  const [startTime, setStartTime] = useState(null);

  const mediaRecorder = useRef(null);
  const mediaStream = useRef(null);
  const mediaChunks = useRef([]);

  const getMediaStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      mediaStream.current = stream;
    } catch (error) {
      throw new Error(error);
    }
  }, ["once"]);

  useEffect(() => {
    if (!window.MediaRecorder) {
      throw new Error("Unsupported Browser");
    }

    async function loadStream() {
      await getMediaStream();
    }

    if (!mediaStream.current) {
      loadStream();
    }
  }, [getMediaStream]);

  const startRecording = async () => {
    setStatus("recording");

    if (!mediaStream.current) {
      await getMediaStream();
    }
    if (mediaStream.current) {
      mediaRecorder.current = new MediaRecorder(mediaStream.current, {
        type: "audio/mpeg"
      });
      mediaRecorder.current.addEventListener(
        "dataavailable",
        onRecordingActive
      );

      mediaRecorder.current.addEventListener("stop", onRecordingStop);
      mediaRecorder.current.addEventListener("error", err => {
        console.error(err);
      });

      mediaRecorder.current.start();
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      mediaRecorder.current.removeEventListener(
        "dataavailable",
        onRecordingActive
      );
      mediaRecorder.current.stream.getTracks().forEach(i => i.stop());
    }
  };

  const onRecordingActive = ({ data }) => {
    mediaChunks.current.push(data);
  };

  const onRecordingStop = () => {
    const blob = new Blob(mediaChunks.current, { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    onHasMediaUrl(url, blob);
  };

  const onClick = () => {
    if (status === "") {
      onClickRecord(true, performance.now());
      startRecording();
    } else if (status === "recording") {
      onClickRecord(false, null);
      stopRecording();
    } else {
      throw new Error("I don't know what to do!");
    }
  };

  return <button onClick={onClick}>Record</button>;
}
