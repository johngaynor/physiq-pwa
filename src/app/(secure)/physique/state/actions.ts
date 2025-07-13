import {
  FETCH_ANALYZE_POSE,
  LOAD_ANALYZE_POSE,
  FETCH_ASSIGN_PHYSIQUE_POSE,
  LOAD_ASSIGN_PHYSIQUE_POSE,
} from "@/app/store/actionTypes";
import { api } from "@/lib/api";
import { AnalyzePoseResult, AssignPoseResult } from "./types";

export const analyzePose = (file: File) => {
  const formData = new FormData();

  // Add the image file
  formData.append("file", file);

  return api
    .route("/api/physique/poses/analyze")
    .fetch(() => ({ type: FETCH_ANALYZE_POSE }))
    .load((data: AnalyzePoseResult) => ({
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
