import {
  ADD_EVENT,
  SET_RECORDING,
  SET_START_TIME,
  SET_PLAYING,
  NEXT_PLAYBACK_INDEX
} from "../types";

export default (state, action) => {
  switch (action.type) {
    case ADD_EVENT:
      if (state.recording) {
        return {
          ...state,
          events: state.events.concat(action.payload)
        };
      } else {
        return state;
      }
    case SET_RECORDING:
      if (action.payload) {
        return {
          ...state,
          recording: true,
          events: [{ time: 0, line: 0 }]
        };
      } else {
        return {
          ...state,
          recording: false
        };
      }

    case SET_START_TIME:
      return {
        ...state,
        startTime: action.payload
      };
    case SET_PLAYING:
      return {
        ...state,
        playing: !state.playing,
        playbackIndex: 0
      };
    case NEXT_PLAYBACK_INDEX:
      return {
        ...state,
        playbackIndex: state.playbackIndex + 1
      };
    default:
      return state;
  }
};
