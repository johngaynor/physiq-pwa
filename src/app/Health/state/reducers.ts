import {
  FETCH_HEALTH_DAILY_LOGS,
  LOAD_HEALTH_DAILY_LOGS,
  FETCH_EDIT_HEALTH_DAILY_WEIGHT,
  LOAD_EDIT_HEALTH_DAILY_WEIGHT,
  FETCH_EDIT_HEALTH_DAILY_STEPS,
  LOAD_EDIT_HEALTH_DAILY_STEPS,
  FETCH_HEALTH_SUPPLEMENTS,
  LOAD_HEALTH_SUPPLEMENTS,
  FETCH_HEALTH_SUPPLEMENT_LOGS,
  LOAD_HEALTH_SUPPLEMENT_LOGS,
} from "../../store/actionTypes";
import type { HealthState, Action } from "./types";

const DEFAULT_STATE: HealthState = {
  dailyLogs: null,
  dailyLogsLoading: false,
  editWeightLoading: false,
  editStepsLoading: false,
  supplements: null,
  supplementsLoading: false,
  supplementLogs: null,
  supplementLogsLoading: false,
};

export default function healthReducer(
  state = DEFAULT_STATE,
  action: Action
): HealthState {
  switch (action.type) {
    case FETCH_HEALTH_DAILY_LOGS:
      return {
        ...state,
        dailyLogsLoading: true,
      };
    case LOAD_HEALTH_DAILY_LOGS:
      return {
        ...state,
        dailyLogsLoading: false,
        dailyLogs: action.data,
      };
    case FETCH_EDIT_HEALTH_DAILY_WEIGHT: {
      let found = false;

      const newWeightLogs =
        state.dailyLogs?.map((log) => {
          if (log.date === action.date) {
            found = true;
            return { ...log, weight: action.weight };
          }
          return log;
        }) || [];

      if (!found) {
        newWeightLogs.push({ date: action.date, weight: action.weight });
      }

      return {
        ...state,
        editWeightLoading: true,
        dailyLogs: newWeightLogs,
      };
    }
    case LOAD_EDIT_HEALTH_DAILY_WEIGHT:
      return {
        ...state,
        editWeightLoading: false,
      };
    case FETCH_EDIT_HEALTH_DAILY_STEPS: {
      let found = false;

      const newStepLogs =
        state.dailyLogs?.map((log) => {
          if (log.date === action.date) {
            found = true;
            return { ...log, weight: action.steps };
          }
          return log;
        }) || [];

      if (!found) {
        newStepLogs.push({ date: action.date, steps: action.steps });
      }

      return {
        ...state,
        editStepsLoading: true,
        dailyLogs: newStepLogs,
      };
    }
    case LOAD_EDIT_HEALTH_DAILY_STEPS:
      return {
        ...state,
        editStepsLoading: false,
      };
    case FETCH_HEALTH_SUPPLEMENTS:
      return {
        ...state,
        supplementsLoading: true,
      };
    case LOAD_HEALTH_SUPPLEMENTS:
      return {
        ...state,
        supplementsLoading: false,
        supplements: action.data,
      };
    case FETCH_HEALTH_SUPPLEMENT_LOGS:
      return {
        ...state,
        supplementLogsLoading: true,
      };
    case LOAD_HEALTH_SUPPLEMENT_LOGS:
      return {
        ...state,
        supplementLogsLoading: false,
        supplementLogs: action.data,
      };
    default:
      return state;
  }
}
