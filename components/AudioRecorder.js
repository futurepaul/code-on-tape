import { useState, useRef, useCallback, useEffect, useContext } from "react";
import EditorContext from "../context/editor/editorContext";

export default function AudioRecorder({ onClickRecord }) {
  const editorContext = useContext(EditorContext);
  const { setAudioURL, setAudioBlob, setRecordingError } = editorContext;
  const [status, setStatus] = useState("");

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
      setRecordingError("microphone");
      console.error(error);
    }
  }, ["once"]);

  useEffect(() => {
    if (!window.MediaRecorder) {
      setRecordingError("browser");
      console.error("Unsupported browser");
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
        setRecordingError(err.message);
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
    setAudioURL(url);
    setAudioBlob(blob);
  };

  const onClick = () => {
    if (status === "") {
      onClickRecord(true, performance.now());
      startRecording();
    } else if (status === "recording") {
      onClickRecord(false, null);
      stopRecording();
    } else {
      let error = new Error("I don't know how this happened.");
      setRecordingError(error.message);
      console.error(error);
    }
  };

  return (
    <>
      <button className={status === "recording" && "active"} onClick={onClick}>
        {status === "recording" ? "Stop Recording" : "Record"}
      </button>

      <style jsx>{`
        button {
          border: solid 1px black;
          background-color: #00ffff;
          margin: 1rem;
        }

        button.active {
          background-color: red;
        }
      `}</style>
    </>
  );
}
