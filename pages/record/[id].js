import { useState, useContext } from "react";
import RecordEditor from "../../components/Editor/RecordEditor";
import RecordControls from "../../components/RecordControls";
import Tabs from "../../components/Tabs";
import WarningBanner from "../../components/WarningBanner";
import { useRouter } from "next/router";
import { myFakeJson } from "../../fake_data";
import EditorContext from "../../context/editor/editorContext";
import Router from "next/router";
import fetch from "isomorphic-unfetch";
import useRecorder from "../../hooks/useRecorder";

const defaultCursor = { lineNumber: 1, column: 1 };

const Record = ({ gistID, files }) => {
  // App state
  const [cursor, setCursor] = useState(defaultCursor);
  const [activeTab, setActiveTab] = useState(0);

  const [perTabCursor, setPerTabCursor] = useState([]);

  // Event recording logic
  const [eventLog, setEventLog] = useState(null);
  const [recordingStartTime, setRecordingStartTime] = useState(null);
  const [isRecording, setIsRecording] = useState(null);
  // const [time, setTime] = useState(0);

  // Audio recording
  let [
    audioURL,
    audioBlob,
    isRecordingAudio,
    startRecordingAudio,
    stopRecordingAudio
  ] = useRecorder();

  // Editor context for forwarding state to the playback preview
  const editorContext = useContext(EditorContext);
  const {
    setGists,
    setGistID,
    saveEventLog,
    setAudioURL,
    setAudioBlob
  } = editorContext;

  const setTabAndCursor = (tab, cursor) => {
    console.log(
      `tab: ${tab}, cursor: { line: ${cursor.lineNumber}, column: ${cursor.column}}`
    );
    let tempPerTabCursor = perTabCursor;
    tempPerTabCursor[tab] = cursor;
    setPerTabCursor(tempPerTabCursor);
    setActiveTab(tab);
    setCursor(cursor);
  };

  const onClickRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      startRecordingAudio();
      setEventLog([{ time: 0, cursor: cursor, tab: activeTab }]);
      console.log("Starting recording");
      setRecordingStartTime(performance.now());
    } else {
      setIsRecording(false);
      stopRecordingAudio();
      console.log("Stopping recording");
      console.log(eventLog);
    }
  };

  const onCursorChange = e => {
    let newCursor = { lineNumber: e.lineNumber, column: e.column };
    if (isRecording) {
      let event = {
        time: Math.floor(performance.now() - recordingStartTime),
        cursor: newCursor,
        tab: activeTab
      };
      setEventLog(eventLog.concat(event));
    }
    setTabAndCursor(activeTab, newCursor);
  };

  const onTabChange = newTabID => {
    console.log(perTabCursor[newTabID]);
    let cursor = perTabCursor[newTabID]
      ? perTabCursor[newTabID]
      : defaultCursor;
    if (isRecording) {
      let event = {
        time: Math.floor(performance.now() - recordingStartTime),
        cursor,
        tab: newTabID
      };
      setEventLog(eventLog.concat(event));
    }
    setTabAndCursor(newTabID, cursor);
  };

  const gotoPlaybackPreview = () => {
    setGists(files);
    setGistID(gistID);
    saveEventLog(eventLog);
    setAudioURL(audioURL);
    setAudioBlob(audioBlob);
    Router.push("/play");
  };

  return (
    <div>
      {!isRecording && eventLog && eventLog.length > 1 ? (
        <>
          <WarningBanner>
            Recorded!
            <button className="continue" onClick={gotoPlaybackPreview}>
              Go to playback preview
            </button>
            <button className="danger">Clear recording and start over</button>
          </WarningBanner>
          <style jsx>{`
            button {
              border: solid 1px black;
              background: white;
              margin-left: 1em;
            }

            .danger {
              background: none;
              color: white;
            }
          `}</style>
        </>
      ) : (
        <RecordControls
          onClickRecord={onClickRecord}
          isRecording={isRecording}
          cursor={cursor}
        />
      )}
      <Tabs activeTab={activeTab} setActiveTab={onTabChange} files={files} />
      <RecordEditor
        gist={files}
        tabID={activeTab}
        cursor={cursor}
        onCursorChange={onCursorChange}
      />
    </div>
  );
};

const client_id = process.env.GITHUB_CLIENT_ID;
const client_secret = process.env.GITHUB_CLIENT_SECRET;
// const query = "7c09ce3491dcfb9ca103bc46127435d4";

Record.getInitialProps = async ctx => {
  let query = ctx.query.id;
  try {
    let url = `https://api.github.com/gists/${query}?client_id=${client_id}&client_secret=${client_secret}`;
    const res = await fetch(url);
    let json = await res.json();
    let gistFiles = json.files;

    let files = Object.keys(gistFiles).map(key => gistFiles[key]);
    // let files = myFakeJson;
    return { gistID: query, files: files };
  } catch (error) {
    console.error(error);
    return {
      gistID: null,
      gists: null
    };
  }
};

export default Record;
