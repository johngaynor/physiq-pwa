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
  FETCH_TOGGLE_HEALTH_SUPPLEMENT_LOG,
  LOAD_TOGGLE_HEALTH_SUPPLEMENT_LOG,
  FETCH_EDIT_HEALTH_DAILY_BODYFAT,
  LOAD_EDIT_HEALTH_DAILY_BODYFAT,
  FETCH_EDIT_HEALTH_DAILY_WATER,
  LOAD_EDIT_HEALTH_DAILY_WATER,
  FETCH_EDIT_HEALTH_DAILY_CALORIES,
  LOAD_EDIT_HEALTH_DAILY_CALORIES,
  FETCH_EDIT_HEALTH_DAILY_SLEEP,
  LOAD_EDIT_HEALTH_DAILY_SLEEP,
  FETCH_HEALTH_SUPPLEMENT_TAGS,
  LOAD_HEALTH_SUPPLEMENT_TAGS,
  FETCH_HEALTH_SLEEP_LOGS,
  LOAD_HEALTH_SLEEP_LOGS,
  FETCH_EDIT_HEALTH_SLEEP_LOG,
  LOAD_EDIT_HEALTH_SLEEP_LOG,
} from "../../../store/actionTypes";
import type { HealthState, Action } from "./types";

const DEFAULT_STATE: HealthState = {
  dailyLogs: null,
  dailyLogsLoading: false,
  editWeightLoading: false,
  editStepsLoading: false,
  editBodyfatLoading: false,
  editWaterLoading: false,
  editCaloriesLoading: false,
  editSleepLoading: false,
  supplements: null,
  supplementsLoading: false,
  supplementLogs: null,
  supplementLogsLoading: false,
  toggleSupplementLoading: false,
  supplementTags: null,
  supplementTagsLoading: false,
  sleepLogs: null,
  sleepLogsLoading: false,
  editSleepLogLoading: false,
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
            return { ...log, steps: action.steps };
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
    case FETCH_TOGGLE_HEALTH_SUPPLEMENT_LOG:
      let toggledLogs = [...(state.supplementLogs || [])];
      if (!action.checked) {
        // remove
        toggledLogs = toggledLogs.filter(
          (log) =>
            !(
              log.date === action.date &&
              log.supplementId === action.supplementId
            )
        );
      } else {
        // add to array
        toggledLogs.push({
          date: action.date,
          supplementId: action.supplementId,
          completed: true,
          reason: null,
        });
      }

      return {
        ...state,
        toggleSupplementLoading: true,
        supplementLogs: toggledLogs || [],
      };
    case LOAD_TOGGLE_HEALTH_SUPPLEMENT_LOG:
      return {
        ...state,
        toggleSupplementLoading: false,
      };
    case FETCH_EDIT_HEALTH_DAILY_BODYFAT: {
      let found = false;

      const newBodyfatLogs =
        state.dailyLogs?.map((log) => {
          if (log.date === action.date) {
            found = true;
            return { ...log, bodyfat: action.bodyfat };
          }
          return log;
        }) || [];

      if (!found) {
        newBodyfatLogs.push({ date: action.date, bodyfat: action.bodyfat });
      }

      return {
        ...state,
        editBodyfatLoading: true,
        dailyLogs: newBodyfatLogs,
      };
    }
    case LOAD_EDIT_HEALTH_DAILY_BODYFAT:
      return {
        ...state,
        editBodyfatLoading: false,
      };
    case FETCH_EDIT_HEALTH_DAILY_WATER: {
      let found = false;

      const newWaterLogs =
        state.dailyLogs?.map((log) => {
          if (log.date === action.date) {
            found = true;
            return { ...log, water: action.water };
          }
          return log;
        }) || [];

      if (!found) {
        newWaterLogs.push({ date: action.date, water: action.water });
      }

      return {
        ...state,
        editWaterLoading: true,
        dailyLogs: newWaterLogs,
      };
    }
    case LOAD_EDIT_HEALTH_DAILY_WATER:
      return {
        ...state,
        editWaterLoading: false,
      };
    case FETCH_EDIT_HEALTH_DAILY_CALORIES: {
      let found = false;

      const newCalorieLogs =
        state.dailyLogs?.map((log) => {
          if (log.date === action.date) {
            found = true;
            return { ...log, calories: action.calories };
          }
          return log;
        }) || [];

      if (!found) {
        newCalorieLogs.push({ date: action.date, calories: action.calories });
      }

      return {
        ...state,
        editCaloriesLoading: true,
        dailyLogs: newCalorieLogs,
      };
    }
    case LOAD_EDIT_HEALTH_DAILY_CALORIES:
      return {
        ...state,
        editCaloriesLoading: false,
      };
    case FETCH_EDIT_HEALTH_DAILY_SLEEP:
      return {
        ...state,
        editSleepLoading: true,
      };
    case LOAD_EDIT_HEALTH_DAILY_SLEEP:
      let found = false;

      const newSleepLogs =
        state.dailyLogs?.map((log) => {
          if (log.date === action.data?.date) {
            found = true;
            return { ...log, ...action.data };
          }
          return log;
        }) || [];

      if (!found) {
        newSleepLogs.push({ ...action.data });
      }
      return {
        ...state,
        editSleepLoading: false,
        dailyLogs: newSleepLogs,
      };
    case FETCH_HEALTH_SUPPLEMENT_TAGS:
      return {
        ...state,
        supplementTagsLoading: true,
      };
    case LOAD_HEALTH_SUPPLEMENT_TAGS:
      return {
        ...state,
        supplementTagsLoading: false,
        supplementTags: action.data,
      };
    case FETCH_HEALTH_SLEEP_LOGS:
      return {
        ...state,
        sleepLogsLoading: true,
      };
    case LOAD_HEALTH_SLEEP_LOGS:
      return {
        ...state,
        sleepLogsLoading: false,
        sleepLogs: action.data,
      };
    case FETCH_EDIT_HEALTH_SLEEP_LOG:
      return {
        ...state,
        editSleepLogLoading: true,
      };
    case LOAD_EDIT_HEALTH_SLEEP_LOG:
      if (action.data.existing) {
        return {
          ...state,
          editSleepLogLoading: false,
          sleepLogs:
            state.sleepLogs?.map((log) =>
              log.id === action.data.log.id ? action.data.log : log
            ) || null,
        };
      } else
        return {
          ...state,
          editSleepLogLoading: false,
          sleepLogs: state.sleepLogs
            ? [...state.sleepLogs, action.data.log]
            : [action.data.log],
        };
    default:
      return state;
  }
}
