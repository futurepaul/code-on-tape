import React, { useReducer } from "react";
import EditorContext from "./editorContext";
import EditorReducer from "./editorReducer";

import {
  SET_CURRENT_LINE,
  SET_GIST_ID,
  SET_GISTS,
  SET_EVENTS,
  SET_AUDIO_URL,
  SET_AUDIO_BLOB,
  SET_RECORDING_ERROR
} from "../types";

const EditorState = props => {
  const initialState = {
    value: "",
    currentLine: "",
    gistID: "",
    gists: [],
    activeTab: 0,
    events: [],
    audioURL: "",
    audioBlob: null,
    recordingError: null
  };

  const [state, dispatch] = useReducer(EditorReducer, initialState);

  const setCurrentLine = lineNum => {
    dispatch({
      type: SET_CURRENT_LINE,
      payload: lineNum
    });
  };

  const setGistID = gistID => {
    dispatch({
      type: SET_GIST_ID,
      payload: gistID
    });
  };

  const setGists = gists => {
    dispatch({
      type: SET_GISTS,
      payload: gists
    });
  };

  const saveEventLog = events => {
    dispatch({
      type: SET_EVENTS,
      payload: events
    });
  };

  const setAudioURL = url => {
    dispatch({
      type: SET_AUDIO_URL,
      payload: url
    });
  };

  const setAudioBlob = blob => {
    dispatch({
      type: SET_AUDIO_BLOB,
      payload: blob
    });
  };

  const setRecordingError = errorString => {
    dispatch({
      type: SET_RECORDING_ERROR,
      payload: errorString
    });
  };

  return (
    <EditorContext.Provider
      value={{
        value: state.value,
        events: state.events,
        currentLine: state.currentLine,
        gists: state.gists,
        gistID: state.gistID,
        activeTab: state.activeTab,
        audioURL: state.audioURL,
        audioBlob: state.audioBlob,
        setCurrentLine,
        setGistID,
        setGists,
        saveEventLog,
        setAudioURL,
        setAudioBlob,
        recordingError: state.recordingError,
        setRecordingError
      }}
    >
      {props.children}
    </EditorContext.Provider>
  );
};

export default EditorState;
