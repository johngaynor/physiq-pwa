export interface PhysiqueState {
  analyzePoseLoading: boolean;
  analyzePoseResult: any | null;
  assignPoseLoading: boolean;
  poses: Pose[] | null;
  posesLoading: boolean;
}

export interface Pose {
  id: number;
  name: string;
  description?: string;
}

export interface AnalyzePoseResult {
  // TODO: Define the structure of the pose analysis result
  // This will depend on what the backend returns
  id?: number;
  result?: any;
  message?: string;
}

export interface AssignPoseResult {
  // TODO: Define the structure of the pose assignment result
  success?: boolean;
  message?: string;
  assignedPose?: string;
}

export type Action =
  | { type: "FETCH_ANALYZE_POSE" }
  | { type: "LOAD_ANALYZE_POSE"; data: AnalyzePoseResult }
  | { type: "FETCH_ASSIGN_PHYSIQUE_POSE" }
  | { type: "LOAD_ASSIGN_PHYSIQUE_POSE"; data: AssignPoseResult }
  | { type: "FETCH_PHYSIQUE_POSES" }
  | { type: "LOAD_PHYSIQUE_POSES"; data: Pose[] };
