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
  bodyfat?: number | null;
  water?: number | null;
  calories?: number | null;
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
  | { type: typeof LOAD_HEALTH_SUPPLEMENT_LOGS; data: SupplementLog[] }
  | {
      type: typeof FETCH_TOGGLE_HEALTH_SUPPLEMENT_LOG;
      date: string;
      supplementId: number;
      checked: boolean;
    }
  | { type: typeof LOAD_TOGGLE_HEALTH_SUPPLEMENT_LOG }
  | { type: typeof LOAD_EDIT_HEALTH_DAILY_WEIGHT }
  | {
      type: typeof FETCH_EDIT_HEALTH_DAILY_BODYFAT;
      date: string;
      bodyfat: number;
    }
  | { type: typeof LOAD_EDIT_HEALTH_DAILY_BODYFAT }
  | {
      type: typeof FETCH_EDIT_HEALTH_DAILY_WATER;
      date: string;
      water: number;
    }
  | { type: typeof LOAD_EDIT_HEALTH_DAILY_WATER }
  | {
      type: typeof FETCH_EDIT_HEALTH_DAILY_CALORIES;
      date: string;
      calories: number;
    }
  | { type: typeof LOAD_EDIT_HEALTH_DAILY_CALORIES };

export interface HealthState {
  dailyLogs: DailyLog[] | null;
  dailyLogsLoading: boolean;
  editWeightLoading: boolean;
  editStepsLoading: boolean;
  editBodyfatLoading: boolean;
  editWaterLoading: boolean;
  editCaloriesLoading: boolean;
  supplements: Supplement[] | null;
  supplementsLoading: boolean;
  supplementLogs: SupplementLog[] | null;
  supplementLogsLoading: boolean;
  toggleSupplementLoading: boolean;
}
