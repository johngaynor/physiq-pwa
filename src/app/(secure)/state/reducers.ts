import { FETCH_APPS, LOAD_APPS } from "../../store/actionTypes";
import type { AppState, Action } from "./types";

const DEFAULT_STATE: AppState = {
  apps: null,
  appsLoading: false,
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
    default:
      return state;
  }
}
