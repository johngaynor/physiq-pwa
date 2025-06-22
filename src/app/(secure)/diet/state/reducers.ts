import {
  FETCH_DIET_LOGS,
  LOAD_DIET_LOGS,
  FETCH_EDIT_DIET_LOG,
  LOAD_EDIT_DIET_LOG,
  FETCH_DELETE_DIET_LOG,
  LOAD_DELETE_DIET_LOG,
} from "../../../store/actionTypes";
import type { DietState, Action } from "./types";

const DEFAULT_STATE: DietState = {
  dietLogs: null,
  dietLogsLoading: false,
  editDietLogLoading: false,
  deleteDietLogLoading: false,
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
      if (action.data.existing) {
        return {
          ...state,
          editDietLogLoading: false,
          dietLogs:
            state.dietLogs?.map((log) =>
              log.id === action.data.log.id ? action.data.log : log
            ) || null,
        };
      } else
        return {
          ...state,
          editDietLogLoading: false,
          dietLogs: state.dietLogs
            ? [...state.dietLogs, action.data.log]
            : [action.data.log],
        };
    case FETCH_DELETE_DIET_LOG:
      return {
        ...state,
        deleteDietLogLoading: true,
      };
    case LOAD_DELETE_DIET_LOG:
      return {
        ...state,
        deleteDietLogLoading: false,
        dietLogs: state.dietLogs
          ? state.dietLogs.filter((log) => log.id !== action.id)
          : null,
      };
    default:
      return state;
  }
}
