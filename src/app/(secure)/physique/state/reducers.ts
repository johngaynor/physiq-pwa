import {
  FETCH_ANALYZE_POSE,
  LOAD_ANALYZE_POSE,
  FETCH_ASSIGN_PHYSIQUE_POSE,
  LOAD_ASSIGN_PHYSIQUE_POSE,
  FETCH_PHYSIQUE_POSES,
  LOAD_PHYSIQUE_POSES,
  FETCH_PHYSIQUE_POSE_TRAINING_PHOTOS,
  LOAD_PHYSIQUE_POSE_TRAINING_PHOTOS,
} from "@/app/store/actionTypes";
import { PhysiqueState, Action } from "./types";

const initialState: PhysiqueState = {
  analyzePoseLoading: false,
  analyzePoseResult: null,
  assignPoseLoading: false,
  poses: null,
  posesLoading: false,
  poseTrainingPhotos: null,
  poseTrainingPhotosLoading: false,
};

export default function physiqueReducer(
  state: PhysiqueState = initialState,
  action: Action
): PhysiqueState {
  switch (action.type) {
    case FETCH_ANALYZE_POSE:
      return {
        ...state,
        analyzePoseLoading: true,
      };

    case LOAD_ANALYZE_POSE:
      return {
        ...state,
        analyzePoseLoading: false,
        analyzePoseResult: action.data,
      };

    case FETCH_ASSIGN_PHYSIQUE_POSE:
      return {
        ...state,
        assignPoseLoading: true,
      };

    case LOAD_ASSIGN_PHYSIQUE_POSE:
      return {
        ...state,
        assignPoseLoading: false,
      };

    case FETCH_PHYSIQUE_POSES:
      return {
        ...state,
        posesLoading: true,
      };

    case LOAD_PHYSIQUE_POSES:
      return {
        ...state,
        posesLoading: false,
        poses: action.data,
      };

    case FETCH_PHYSIQUE_POSE_TRAINING_PHOTOS:
      return {
        ...state,
        poseTrainingPhotosLoading: true,
      };

    case LOAD_PHYSIQUE_POSE_TRAINING_PHOTOS:
      return {
        ...state,
        poseTrainingPhotosLoading: false,
        poseTrainingPhotos: action.data,
      };

    default:
      return state;
  }
}
