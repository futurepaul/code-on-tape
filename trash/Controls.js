import React, { useContext, useRef } from "react";
import Link from "next/link";
import EditorContext from "../context/editor/editorContext";
import useRecorder from "../hooks/useRecorder.ts";
import AppContext from "../context/app/appContext";

const Controls = ({ gistID }) => {
  const editorContext = useContext(EditorContext);
  const appContext = useContext(AppContext);

  const { setRecording, events, recording } = appContext;
  // const { gistID, value } = editorContext;

  let [
    audioURL,
    audioBlob,
    isRecordingAudio,
    startRecordingAudio,
    stopRecordingAudio
  ] = useRecorder();

  let audioPlayerEl = useRef(null);

  const startRecording = () => {
    setRecording(true);
    startRecordingAudio();
  };

  const stopRecording = () => {
    setRecording(false);
    stopRecordingAudio();
  };

  const playAudio = () => {
    audioPlayerEl.current.play();
  };

  const exportJson = () => {
    let output = {
      gist: gistID,
      code: value,
      events: events
    };

    // let jsonOutput = JSON.stringify(output);

    console.log(output);
  };

  return (
    <>
      <div className={`controls ${recording ? "recording" : ""}`}>
        <button onClick={startRecording}>Start recording</button>
        <button onClick={stopRecording}>Stop recording</button>

        <button onClick={playAudio}>Play</button>
        <button onClick={exportJson}>Export</button>
        <Link href={`/play/${gistID}`}>
          <button>Go to player</button>
        </Link>
        <audio ref={audioPlayerEl} src={audioURL} />
      </div>
      <style jsx>{`
        .recording {
          background-color: red;
        }
        .controls {
          padding: 1rem;
        }
      `}</style>
    </>
  );
};

export default Controls;
