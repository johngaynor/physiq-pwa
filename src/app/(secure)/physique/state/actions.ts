import { FETCH_ANALYZE_POSE, LOAD_ANALYZE_POSE } from "@/app/store/actionTypes";
import { api } from "@/lib/api";
import { AnalyzePoseResult } from "./types";

export const analyzePose = (file: File) => {
  const formData = new FormData();

  // Add the image file
  formData.append("file", file);

  return api
    .route("/api/physique/analyze")
    .fetch(() => ({ type: FETCH_ANALYZE_POSE }))
    .load((data: AnalyzePoseResult) => ({
      type: LOAD_ANALYZE_POSE,
      data,
    }))
    .error("Error analyzing pose")
    .data(formData)
    .post();
};
