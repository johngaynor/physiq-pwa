export interface PhysiqueState {
  analyzePoseLoading: boolean;
  analyzePoseResult: any | null;
}

export interface AnalyzePoseResult {
  // TODO: Define the structure of the pose analysis result
  // This will depend on what the backend returns
  id?: number;
  result?: any;
  message?: string;
}

export type Action =
  | { type: "FETCH_ANALYZE_POSE" }
  | { type: "LOAD_ANALYZE_POSE"; data: AnalyzePoseResult };
