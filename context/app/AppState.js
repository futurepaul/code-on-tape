import React, { useReducer } from "react";
import AppReducer from "./appReducer";
import AppContext from "./appContext";

import {
  SET_RECORDING,
  ADD_EVENT,
  SET_START_TIME,
  SET_PLAYING,
  NEXT_PLAYBACK_INDEX
} from "../types";

const AppState = props => {
  const initialState = {
    recording: false,
    playing: false,
    events: [],
    startTime: null,
    playbackIndex: 0
  };

  const [state, dispatch] = useReducer(AppReducer, initialState);

  const addEvent = event => {
    dispatch({
      type: ADD_EVENT,
      payload: event
    });
  };

  const setRecording = recording => {
    if (recording) {
      dispatch({
        type: SET_START_TIME,
        payload: Date.now()
      });
    }

    dispatch({
      type: SET_RECORDING,
      payload: recording
    });
  };

  const setPlaying = () => {
    dispatch({
      type: SET_PLAYING
    });
  };

  const setStartTime = () => {
    dispatch({
      type: SET_START_TIME,
      payload: Date.now()
    });
  };

  const nextPlaybackIndex = () => {
    dispatch({
      type: NEXT_PLAYBACK_INDEX
    });
  };

  return (
    <AppContext.Provider
      value={{
        recording: state.recording,
        events: state.events,
        startTime: state.startTime,
        playbackIndex: state.playbackIndex,
        addEvent,
        setRecording,
        setStartTime,

        nextPlaybackIndex
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppState;
