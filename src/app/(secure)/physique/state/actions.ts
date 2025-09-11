import {
  FETCH_ANALYZE_POSE,
  LOAD_ANALYZE_POSE,
  FETCH_ASSIGN_PHYSIQUE_POSE,
  LOAD_ASSIGN_PHYSIQUE_POSE,
  FETCH_PHYSIQUE_POSES,
  LOAD_PHYSIQUE_POSES,
  FETCH_PHYSIQUE_POSE_TRAINING_PHOTOS,
  LOAD_PHYSIQUE_POSE_TRAINING_PHOTOS,
  FETCH_PHYSIQUE_POSE_MODEL_DATA,
  LOAD_PHYSIQUE_POSE_MODEL_DATA,
} from "@/app/store/actionTypes";
import { api } from "@/lib/api";
import {
  PoseAnalysis,
  AssignPoseResult,
  Pose,
  PoseModelDataResult,
  TrainingPhoto,
} from "./types";

export const analyzePose = (files: File[]) => {
  const formData = new FormData();

  // Add all image files
  files.forEach((file) => {
    formData.append(`files`, file);
  });

  return api
    .route("/api/physique/poses/analyze")
    .fetch(() => ({ type: FETCH_ANALYZE_POSE }))
    .load((data: PoseAnalysis[]) => ({
      type: LOAD_ANALYZE_POSE,
      data,
    }))
    .error("Error analyzing pose")
    .data(formData)
    .post();
};

export const assignPose = (filename: string, id: number) => {
  return api
    .route("/api/physique/poses/assign")
    .fetch(() => ({ type: FETCH_ASSIGN_PHYSIQUE_POSE }))
    .load((data: AssignPoseResult) => ({
      type: LOAD_ASSIGN_PHYSIQUE_POSE,
      data,
    }))
    .error("Error assigning pose")
    .data({ filename, id })
    .post();
};

export const getPoses = () => {
  return api
    .route("/api/physique/poses")
    .fetch(() => ({ type: FETCH_PHYSIQUE_POSES }))
    .load((data: Pose[]) => ({ type: LOAD_PHYSIQUE_POSES, data }))
    .error("Error fetching poses")
    .get();
};

export const getPoseTrainingPhotos = () => {
  return api
    .route("/api/ai/physique/poses")
    .fetch(() => ({ type: FETCH_PHYSIQUE_POSE_TRAINING_PHOTOS }))
    .load((data: TrainingPhoto[]) => ({
      type: LOAD_PHYSIQUE_POSE_TRAINING_PHOTOS,
      data,
    }))
    .error("Error fetching pose training photos")
    .get();
};

export const getPoseModelData = () => {
  return api
    .route("/api/ai/physique/poses/model")
    .fetch(() => ({ type: FETCH_PHYSIQUE_POSE_MODEL_DATA }))
    .load((data: PoseModelDataResult) => ({
      type: LOAD_PHYSIQUE_POSE_MODEL_DATA,
      data,
    }))
    .error("Error fetching pose model data")
    .get();
};
