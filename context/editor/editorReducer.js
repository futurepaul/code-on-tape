import {
  IMPORT_GIST,
  SET_ACTIVE_TAB,
  SET_CURRENT_LINE,
  ADD_EVENT,
  SET_GIST_ID,
  SET_GISTS
} from "../types";

export default (state, action) => {
  switch (action.type) {
    case IMPORT_GIST:
      return {
        ...state,
        gists: action.payload,
        value: action.payload[0].content
      };
    case SET_CURRENT_LINE:
      return {
        ...state,
        currentLine: action.payload
      };
    case SET_GIST_ID:
      return {
        ...state,
        gistID: action.payload
      };
    case SET_GISTS:
      return {
        ...state,
        gists: action.payload,
        value: action.payload[0].content
      };
    default:
      return state;
  }
};
