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

// data object types
export type DailyLog = {
  date: string;
  weight?: number | null;
  steps?: number | null;
  totalBed?: number | null;
  totalSleep?: number | null;
  awakeQty?: number | null;
  lightQty?: number | null;
  remQty?: number | null;
  deepQty?: number | null;
};

export type Supplement = {
  id: number;
  name: string;
  description: string;
  dosage: string | null;
  priority: number;
};

export type SupplementLog = {
  supplementId: number;
  date: string;
  completed: boolean;
  reason: string | null;
};

// action types
export type Action =
  | { type: typeof FETCH_HEALTH_DAILY_LOGS }
  | { type: typeof LOAD_HEALTH_DAILY_LOGS; data: DailyLog[] }
  | {
      type: typeof FETCH_EDIT_HEALTH_DAILY_WEIGHT;
      date: string;
      weight: number;
    }
  | { type: typeof LOAD_EDIT_HEALTH_DAILY_WEIGHT }
  | {
      type: typeof FETCH_EDIT_HEALTH_DAILY_STEPS;
      date: string;
      steps: number;
    }
  | { type: typeof LOAD_EDIT_HEALTH_DAILY_STEPS }
  | { type: typeof FETCH_HEALTH_SUPPLEMENTS }
  | { type: typeof LOAD_HEALTH_SUPPLEMENTS; data: Supplement[] }
  | { type: typeof FETCH_HEALTH_SUPPLEMENT_LOGS }
  | { type: typeof LOAD_HEALTH_SUPPLEMENT_LOGS; data: SupplementLog[] };

export interface HealthState {
  dailyLogs: DailyLog[] | null;
  dailyLogsLoading: boolean;
  editWeightLoading: boolean;
  editStepsLoading: boolean;
  supplements: Supplement[] | null;
  supplementsLoading: boolean;
  supplementLogs: SupplementLog[] | null;
  supplementLogsLoading: boolean;
}
