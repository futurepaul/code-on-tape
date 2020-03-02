import { useState, useContext, useEffect } from "react";
import Editor from "../../components/Editor/Editor";
import RecordControls from "../../components/RecordControls";
import Tabs from "../../components/Tabs";
import WarningBanner from "../../components/WarningBanner";
import EditorContext from "../../context/editor/editorContext";
import Router from "next/router";
import fetch from "isomorphic-unfetch";
import useInterval from "../../hooks/useInterval";
import Layout from "../../components/Layout";

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
  const [timeSoFar, setTimeSoFar] = useState(null);

  // Editor context for forwarding state to the playback preview
  const editorContext = useContext(EditorContext);
  const { setGists, setGistID, saveEventLog, recordingError } = editorContext;

  const setTabAndCursor = (tab, cursor) => {
    if (isRecording) {
      let event = {
        time: Math.floor(performance.now() - recordingStartTime),
        cursor,
        tab
      };
      setEventLog(eventLog.concat(event));
    }

    // console.log(
    //   `tab: ${tab}, cursor: { line: ${cursor.lineNumber}, column: ${cursor.column}}`
    // );
    let tempPerTabCursor = perTabCursor;
    tempPerTabCursor[tab] = cursor;

    setPerTabCursor(tempPerTabCursor);
    setActiveTab(tab);
    setCursor(cursor);
  };

  const onClickRecord = (shouldStart, startTime) => {
    if (shouldStart && startTime) {
      setIsRecording(true);
      setEventLog([{ time: 0, cursor: cursor, tab: activeTab }]);
      console.log("Starting recording");
      setRecordingStartTime(startTime);
    } else {
      setIsRecording(false);
      console.log("Stopping recording");
      console.log(eventLog);
    }
  };

  const onCursorChange = e => {
    let newCursor = { lineNumber: e.lineNumber, column: e.column };
    setTabAndCursor(activeTab, newCursor);
  };

  const requestActiveTab = newTabID => {
    let cursor = perTabCursor[newTabID]
      ? perTabCursor[newTabID]
      : defaultCursor;
    console.log(perTabCursor);
    setTabAndCursor(newTabID, cursor);
  };

  const gotoPlaybackPreview = () => {
    setGists(files);
    setGistID(gistID);
    saveEventLog(eventLog);
    Router.push("/play");
  };

  useInterval(
    () => {
      setTabAndCursor(activeTab, cursor);
      setTimeSoFar(Math.floor(performance.now() - recordingStartTime));
      console.log(
        `Set tab: ${activeTab} and cursor: l: ${cursor.lineNumber}, c: ${cursor.column} using interval`
      );
    },
    isRecording ? 1000 : null
  );

  const success = (
    <WarningBanner>
      Recorded!{" "}
      <button className="continue" onClick={gotoPlaybackPreview}>
        {" "}
        Go to playback preview{" "}
      </button>{" "}
      <button className="danger" onClick={() => location.reload()}>
        Clear recording and start over
      </button>
    </WarningBanner>
  );

  const microphone_fail = (
    <WarningBanner>
      <strong>Error:</strong> Something went wrong. Did you say yes to the
      microphone? <button onClick={() => location.reload()}>Start over</button>
    </WarningBanner>
  );

  const browser_fail = (
    <WarningBanner>
      <strong>Error:</strong> Sorry, your browser isn't supported!
    </WarningBanner>
  );

  return (
    <Layout title="Record">
      {recordingError === "microphone" && microphone_fail}
      {recordingError === "browser" && browser_fail}
      {!isRecording &&
      eventLog &&
      eventLog.length > 1 &&
      recordingError === null
        ? success
        : recordingError === null && (
            <RecordControls
              onClickRecord={onClickRecord}
              cursor={cursor}
              timeSoFar={timeSoFar}
            />
          )}

      <Tabs
        activeTab={activeTab}
        requestActiveTab={requestActiveTab}
        files={files}
      />
      <Editor
        gist={files}
        tabID={activeTab}
        cursor={cursor}
        onCursorChange={onCursorChange}
      />
    </Layout>
  );
};

const client_id = process.env.GITHUB_CLIENT_ID;
const client_secret = process.env.GITHUB_CLIENT_SECRET;

Record.getInitialProps = async ctx => {
  let query = ctx.query.id;
  try {
    let url = `https://api.github.com/gists/${query}?client_id=${client_id}&client_secret=${client_secret}`;
    const res = await fetch(url);
    let json = await res.json();
    let gistFiles = json.files;

    let files = Object.keys(gistFiles).map(key => gistFiles[key]);

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
