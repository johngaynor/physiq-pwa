export interface PhysiqueState {
  analyzePoseLoading: boolean;
  analyzePoseResult: AnalyzePoseResult | null;
  assignPoseLoading: boolean;
  poses: Pose[] | null;
  posesLoading: boolean;
  poseTrainingPhotos: TrainingPhoto[] | null;
  poseTrainingPhotosLoading: boolean;
  poseModelData: PoseModelDataResult | null;
  poseModelDataLoading: boolean;
}

export interface Pose {
  id: number;
  name: string;
  description?: string;
}

export interface TrainingPhoto {
  id: number;
  s3Filename: string | null;
  poseId: number;
  location: "training" | "checkin";
}
export interface PoseModelDataResult {
  totalCalls: number;
  model: {
    id: number;
    versionNum: string;
    githubRepo: string;
    stack: string;
  } | null;
}

export interface AnalyzePoseResult {
  success: boolean;
  fileUploaded: string;
  analysisResult: {
    status: string;
    filename: string;
    image_size: string;
    prediction: {
      predicted_class_index: number;
      predicted_class_id: string;
      predicted_class_name: string;
      confidence: number;
      all_probabilities: Record<string, number>;
      all_probabilities_with_ids: Record<string, number>;
    };
  };
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
  | { type: "LOAD_PHYSIQUE_POSES"; data: Pose[] }
  | { type: "FETCH_PHYSIQUE_POSE_TRAINING_PHOTOS" }
  | {
      type: "LOAD_PHYSIQUE_POSE_TRAINING_PHOTOS";
      data: TrainingPhoto[];
    }
  | { type: "FETCH_PHYSIQUE_POSE_MODEL_DATA" }
  | { type: "LOAD_PHYSIQUE_POSE_MODEL_DATA"; data: PoseModelDataResult };
