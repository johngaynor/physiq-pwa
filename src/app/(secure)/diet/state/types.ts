import { FETCH_DIET_LOGS, LOAD_DIET_LOGS } from "../../../store/actionTypes";

// data object types
export type DietLogSupplement = {
  id?: number;
  logId?: number;
  supplementId: number;
  dosage: string;
  frequency: string;
};

export type DietLog = {
  id: number;
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
  | { type: typeof LOAD_DIET_LOGS; data: DietLog[] };

export interface DietState {
  dietLogs: DietLog[] | null;
  dietLogsLoading: boolean;
}
