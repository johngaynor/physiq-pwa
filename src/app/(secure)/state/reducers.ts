import {
  FETCH_APPS,
  LOAD_APPS,
  FETCH_INITIALIZE_USER,
  LOAD_INITIALIZE_USER,
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
    case FETCH_APPS:
      return {
        ...state,
        appsLoading: true,
      };
    case LOAD_APPS:
      return {
        ...state,
        appsLoading: false,
        apps: action.data,
      };
    case FETCH_INITIALIZE_USER:
      return { ...state };
    case LOAD_INITIALIZE_USER:
      return {
        ...state,
        user: true,
      };
    default:
      return state;
  }
}
