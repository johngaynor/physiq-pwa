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
  ffm?: number | null;
  caloriesTarget?: number | null;
  waterTarget?: number | null;
  stepsTarget?: number | null;
};

export type SupplementTag = {
  id: number;
  name: string;
};

export type Supplement = {
  id: number;
  name: string;
  description: string;
  dosage: string | null;
  priority: number;
  tags: SupplementTag[];
};

export type SupplementLog = {
  supplementId: number;
  date: string;
  completed: boolean;
  reason: string | null;
};

export type DietSupplement = {
  id: number;
  supplementId: number;
  dosage: string | null;
  frequency: string | null;
};

export type DietLog = {
  id: number;
  protein: number;
  carbs: number;
  fats: number;
  calories: number;
  effectiveDate: string;
  cardio: string;
  cardioMinutes: number;
  notes: string;
  water: number;
  steps: number;
};

export type DashboardDietLog = {
  log: DietLog;
  supplements: DietSupplement[];
};

export interface SleepLog {
  id: number;
  userId: number;
  date: string;
  totalSleep: number;
  recoveryIndex: number;
  readinessScore: number;
  awakeQty: number;
  remQty: number;
  lightQty: number;
  deepQty: number;
  totalBed: number;
  bedtimeStart: string;
  bedtimeEnd: string;
  efficiency: number;
  sleepScore: number;
  timingScore: number;
  restfulnessScore: number;
  latency: number;
  tags: SleepLogTag[];
}

export interface SleepLogTag {
  id: number;
  logId: number;
  tagId: number;
  tagTypeCode: string;
  startTime: string;
  endTime: string;
  comment: string;
  qty: number;
  customName: string;
}

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
  | { type: typeof LOAD_EDIT_HEALTH_DAILY_CALORIES }
  | {
      type: typeof FETCH_EDIT_HEALTH_DAILY_SLEEP;
    }
  | { type: typeof LOAD_EDIT_HEALTH_DAILY_SLEEP; data: DailyLog }
  | { type: typeof FETCH_HEALTH_SUPPLEMENT_TAGS }
  | { type: typeof LOAD_HEALTH_SUPPLEMENT_TAGS; data: SupplementTag[] }
  | { type: typeof FETCH_HEALTH_SLEEP_LOGS }
  | { type: typeof LOAD_HEALTH_SLEEP_LOGS; data: SleepLog[] }
  | {
      type: typeof FETCH_EDIT_HEALTH_SLEEP_LOG;
    }
  | {
      type: typeof LOAD_EDIT_HEALTH_SLEEP_LOG;
      data: { existing: boolean; log: SleepLog };
    };
export interface HealthState {
  dailyLogs: DailyLog[] | null;
  dailyLogsLoading: boolean;
  editWeightLoading: boolean;
  editStepsLoading: boolean;
  editBodyfatLoading: boolean;
  editWaterLoading: boolean;
  editCaloriesLoading: boolean;
  editSleepLoading: boolean;
  supplements: Supplement[] | null;
  supplementsLoading: boolean;
  supplementLogs: SupplementLog[] | null;
  supplementLogsLoading: boolean;
  toggleSupplementLoading: boolean;
  supplementTags: SupplementTag[] | null;
  supplementTagsLoading: boolean;
  sleepLogs: SleepLog[] | null;
  sleepLogsLoading: boolean;
  editSleepLogLoading: boolean;
}
