import {
  FETCH_HEALTH_DAILY_LOGS,
  LOAD_HEALTH_DAILY_LOGS,
} from "../../store/actionTypes";
import type { DailyLog } from "./types";

interface HealthState {
  dailyLogs: DailyLog[];
  dailyLogsLoading: boolean;
}

type Action =
  | { type: typeof FETCH_HEALTH_DAILY_LOGS }
  | { type: typeof LOAD_HEALTH_DAILY_LOGS; data: DailyLog[] };

const DEFAULT_STATE: HealthState = {
  dailyLogs: [],
  dailyLogsLoading: false,
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
    default:
      return state;
  }
}
