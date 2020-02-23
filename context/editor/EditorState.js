import React, { useReducer } from "react";
import Router from "next/router";
import EditorContext from "./editorContext";
import EditorReducer from "./editorReducer";

import {
  SET_CURRENT_LINE,
  SET_GIST_ID,
  SET_GISTS,
  SET_EVENTS,
  SET_AUDIO_URL,
  SET_AUDIO_BLOB
} from "../types";

// const client_id = process.env.REACT_APP_GITHUB_CLIENT_ID;
// const client_secret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;

// async function fetchGist(query) {
//   try {
//     let url = `https://api.github.com/gists/${query}?client_id=${client_id}&client_secret=${client_secret}`;
//     const res = await fetch(url);
//     let json = await res.json();
//     let gistFiles = json.files;
//     let gists = Object.keys(gistFiles).map(key => gistFiles[key]);
//     return gists;
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// }

const EditorState = props => {
  const initialState = {
    value: "",
    currentLine: "",
    gistID: "",
    gists: [],
    activeTab: 0,
    events: [],
    audioURL: "",
    audioBlob: null
  };

  const [state, dispatch] = useReducer(EditorReducer, initialState);

  // const importGist = async () => {
  //   if (state.gistID === "") {
  //     alert("Please provide a gist id!");
  //     return;
  //   }
  //   const gists = await fetchGist(state.gistID);
  //   if (!gists[0]) {
  //     alert(`Got no gists at that id: ${gistID}`);
  //     return;
  //   }

  //   dispatch({
  //     type: IMPORT_GIST,
  //     payload: gists
  //   });
  // };

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
        setAudioBlob
      }}
    >
      {props.children}
    </EditorContext.Provider>
  );
};

export default EditorState;
