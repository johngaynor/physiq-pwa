import {
  FETCH_DIET_LOGS,
  LOAD_DIET_LOGS,
  FETCH_EDIT_DIET_LOG,
  LOAD_EDIT_DIET_LOG,
  FETCH_DELETE_DIET_LOG,
  LOAD_DELETE_DIET_LOG,
} from "../../../store/actionTypes";

// data object types
export type DietLogSupplement = {
  id?: number;
  logId?: number;
  supplementId: number;
  name: string;
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
  supplements: DietLogSupplement[] | null;
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
  | { type: typeof LOAD_DELETE_DIET_LOG; id: number };

export interface DietState {
  dietLogs: DietLog[] | null;
  dietLogsLoading: boolean;
  editDietLogLoading?: boolean;
  deleteDietLogLoading?: boolean;
}
