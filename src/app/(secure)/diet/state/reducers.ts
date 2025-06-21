import {
  FETCH_DIET_LOGS,
  LOAD_DIET_LOGS,
  FETCH_EDIT_DIET_LOG,
  LOAD_EDIT_DIET_LOG,
} from "../../../store/actionTypes";
import type { DietState, Action } from "./types";

const DEFAULT_STATE: DietState = {
  dietLogs: null,
  dietLogsLoading: false,
  editDietLogLoading: false,
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
    case FETCH_EDIT_DIET_LOG:
      return {
        ...state,
        editDietLogLoading: true,
      };
    case LOAD_EDIT_DIET_LOG:
      console.log(action.data);
      return {
        ...state,
        editDietLogLoading: false,
        dietLogs: null, // will format this later to update/insert dynamically
      };
    default:
      return state;
  }
}
