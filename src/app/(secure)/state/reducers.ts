import {
  FETCH_INITIALIZE_SESSION,
  LOAD_INITIALIZE_SESSION,
} from "../../store/actionTypes";
import type { AppState, Action } from "./types";

const DEFAULT_STATE: AppState = {
  apps: null,
  appsLoading: false,
  user: false,
};

export default function appReducer(
  state = DEFAULT_STATE,
  action: Action
): AppState {
  switch (action.type) {
    case FETCH_INITIALIZE_SESSION:
      return { ...state, appsLoading: true };
    case LOAD_INITIALIZE_SESSION:
      return {
        ...state,
        user: true,
        apps: action.data.apps,
        appsLoading: false,
      };
    default:
      return state;
  }
}
