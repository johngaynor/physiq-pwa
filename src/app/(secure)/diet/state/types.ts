import {
  FETCH_DIET_LOGS,
  LOAD_DIET_LOGS,
  FETCH_EDIT_DIET_LOG,
  LOAD_EDIT_DIET_LOG,
  FETCH_DELETE_DIET_LOG,
  LOAD_DELETE_DIET_LOG,
  FETCH_HEALTH_DIET_LOGS_LATEST,
  LOAD_HEALTH_DIET_LOGS_LATEST,
} from "../../../store/actionTypes";

// data object types
export type DietSupplement = {
  id?: number;
  logId?: number;
  supplementId: number;
  name?: string;
  dosage: string;
  frequency: string;
};

export type DietLog = {
  id?: number;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  effectiveDate: string;
  cardio: string;
  cardioMinutes: number;
  notes: string;
  water: number;
  steps: number;
  phase: "Maintenance" | "Bulk" | "Cut";
  supplements: DietSupplement[] | null;
};

export type DashboardDietLog = {
  log: DietLog;
  supplements: DietSupplement[];
};

// action types
export type Action =
  | { type: typeof FETCH_DIET_LOGS }
  | { type: typeof LOAD_DIET_LOGS; data: DietLog[] }
  | { type: typeof FETCH_EDIT_DIET_LOG }
  | {
      type: typeof LOAD_EDIT_DIET_LOG;
      data: { existing: boolean; log: DietLog };
    }
  | { type: typeof FETCH_DELETE_DIET_LOG }
  | { type: typeof LOAD_DELETE_DIET_LOG; id: number }
  | { type: typeof FETCH_HEALTH_DIET_LOGS_LATEST }
  | { type: typeof LOAD_HEALTH_DIET_LOGS_LATEST; data: DashboardDietLog };

export interface DietState {
  dietLogs: DietLog[] | null;
  dietLogsLoading: boolean;
  editDietLogLoading?: boolean;
  deleteDietLogLoading?: boolean;
  dietLog: DietLog | null;
  dietSupplements: DietSupplement[] | null;
  dietLogLoading: boolean;
}
