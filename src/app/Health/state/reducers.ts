type DailyLog = {
  userId: string;
  date: string;
  weight: number | null;
  steps: number | null;
  totalBed: number | null;
  totalSleep: number | null;
  awakeQty: number | null;
  lightQty: number | null;
  remQty: number | null;
  deepQty: number | null;
};

interface HealthState {
  dailyLogs: DailyLog[];
  dailyLogsLoading: boolean;
}

type Action =
  | { type: "FETCH_HEALTH_DAILY_LOGS" }
  | { type: "LOAD_HEALTH_DAILY_LOGS"; data: DailyLog[] };

const DEFAULT_STATE: HealthState = {
  dailyLogs: [],
  dailyLogsLoading: false,
};

export default (state = DEFAULT_STATE, action: Action) => {
  switch (action.type) {
    case "FETCH_HEALTH_DAILY_LOGS":
      return {
        ...state,
        dailyLogsLoading: true,
      };
    case "LOAD_HEALTH_DAILY_LOGS":
      return {
        ...state,
        dailyLogsLoading: false,
        dailyLogs: action.data,
      };
    default:
      return state;
  }
};
