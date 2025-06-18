import { FETCH_DIET_LOGS, LOAD_DIET_LOGS } from "../../../store/actionTypes";
import type { DietState, Action } from "./types";

const DEFAULT_STATE: DietState = {
  dietLogs: null,
  dietLogsLoading: false,
};

export default function healthReducer(
  state = DEFAULT_STATE,
  action: Action
): DietState {
  switch (action.type) {
    case FETCH_DIET_LOGS:
      return {
        ...state,
        dietLogsLoading: true,
      };
    case LOAD_DIET_LOGS:
      return {
        ...state,
        dietLogsLoading: false,
        dietLogs: action.data,
      };
    default:
      return state;
  }
}
