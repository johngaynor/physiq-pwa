import {
  FETCH_EXERCISES,
  LOAD_EXERCISES,
  FETCH_EDIT_EXERCISE,
  LOAD_EDIT_EXERCISE,
  FETCH_DELETE_EXERCISE,
  LOAD_DELETE_EXERCISE,
  FETCH_GYMS,
  LOAD_GYMS,
  FETCH_EDIT_GYM,
  LOAD_EDIT_GYM,
  FETCH_DELETE_GYM,
  LOAD_DELETE_GYM,
  FETCH_GYM_PHOTOS,
  LOAD_GYM_PHOTOS,
  FETCH_UPLOAD_GYM_PHOTOS,
  LOAD_UPLOAD_GYM_PHOTOS,
  FETCH_DELETE_GYM_PHOTO,
  LOAD_DELETE_GYM_PHOTO,
  FETCH_EDIT_GYM_REVIEW,
  LOAD_EDIT_GYM_REVIEW,
  FETCH_TRAINING_SESSION_SYNCS,
  LOAD_TRAINING_SESSION_SYNCS,
} from "../../../store/actionTypes";
import type { TrainingState, Action, Review } from "./types";

const DEFAULT_STATE: TrainingState = {
  exercises: null,
  exercisesLoading: false,
  editExerciseLoading: false,
  gyms: null,
  gymsLoading: false,
  editGymLoading: false,
  editGymReviewLoading: false,
  gymPhotos: [],
  gymPhotosLoading: false,
  gymPhotosId: null,
  uploadGymPhotosLoading: false,
  deleteGymPhotoLoading: false,
  syncSessionsLoading: false,
  syncSessionsResult: "idle",
};

export default function appReducer(
  state = DEFAULT_STATE,
  action: Action
): TrainingState {
  switch (action.type) {
    case FETCH_EXERCISES:
      return { ...state, exercisesLoading: true };
    case LOAD_EXERCISES:
      return {
        ...state,
        exercises: action.data,
        exercisesLoading: false,
      };
    case FETCH_EDIT_EXERCISE:
      return { ...state, editExerciseLoading: true };
    case LOAD_EDIT_EXERCISE:
      return {
        ...state,
        exercises: state.exercises
          ? state.exercises.some((e) => e.id === action.data.id)
            ? state.exercises.map((e) =>
                e.id === action.data.id ? action.data : e
              )
            : [...state.exercises, action.data]
          : [action.data],
        editExerciseLoading: false,
      };
    case FETCH_DELETE_EXERCISE:
      return { ...state, exercisesLoading: true };
    case LOAD_DELETE_EXERCISE:
      return {
        ...state,
        exercises:
          state.exercises?.filter((exercise) => exercise.id !== action.id) ||
          [],
        exercisesLoading: false,
      };
    case FETCH_GYMS:
      return { ...state, gymsLoading: true };
    case LOAD_GYMS:
      return {
        ...state,
        gyms: action.data,
        gymsLoading: false,
      };
    case FETCH_EDIT_GYM:
      return { ...state, editGymLoading: true };
    case LOAD_EDIT_GYM:
      return {
        ...state,
        gyms: state.gyms
          ? state.gyms.some((g) => g.id === action.data.id)
            ? state.gyms.map((g) => (g.id === action.data.id ? action.data : g))
            : [...state.gyms, action.data]
          : [action.data],
        editGymLoading: false,
      };
    case FETCH_DELETE_GYM:
      return { ...state, gymsLoading: true };
    case LOAD_DELETE_GYM:
      return {
        ...state,
        gyms: state.gyms?.filter((gym) => gym.id !== action.id) || [],
        gymsLoading: false,
      };
    case FETCH_GYM_PHOTOS:
      return {
        ...state,
        gymPhotosLoading: true,
        gymPhotosId: action.gymId,
      };
    case LOAD_GYM_PHOTOS:
      return {
        ...state,
        gymPhotos: action.photos,
        gymPhotosLoading: false,
        gymPhotosId: action.gymId,
      };
    case FETCH_UPLOAD_GYM_PHOTOS:
      return {
        ...state,
        uploadGymPhotosLoading: true,
      };
    case LOAD_UPLOAD_GYM_PHOTOS:
      return {
        ...state,
        uploadGymPhotosLoading: false,
        gymPhotos: [], // Reset to refetch
        gymPhotosId: null, // Clear to trigger refetch
      };
    case FETCH_DELETE_GYM_PHOTO:
      return {
        ...state,
        deleteGymPhotoLoading: true,
      };
    case LOAD_DELETE_GYM_PHOTO:
      return {
        ...state,
        deleteGymPhotoLoading: false,
        gymPhotos: state.gymPhotos.filter(
          (photo) => photo.id !== action.photoId
        ),
      };
    case FETCH_EDIT_GYM_REVIEW:
      return {
        ...state,
        editGymReviewLoading: true,
      };
    case LOAD_EDIT_GYM_REVIEW: {
      const newGyms =
        state.gyms?.map((gym) => {
          if (gym.id === action.gymId) {
            const existingReviews = gym.reviews || [];
            const existingReviewIndex = existingReviews.findIndex(
              (review) => review.id === action.review.id
            );

            let updatedReviews: Review[];

            if (existingReviewIndex !== -1) {
              // Update existing review
              updatedReviews = existingReviews.map((review, index) =>
                index === existingReviewIndex ? action.review : review
              );
            } else {
              // Add new review
              updatedReviews = [...existingReviews, action.review];
            }
            return {
              ...gym,
              reviews: updatedReviews,
            };
          }
          return gym;
        }) || null;

      return {
        ...state,
        gyms: newGyms,
        editGymReviewLoading: false,
      };
    }

    case FETCH_TRAINING_SESSION_SYNCS:
      return {
        ...state,
        syncSessionsLoading: true,
        syncSessionsResult: "idle",
      };
    case LOAD_TRAINING_SESSION_SYNCS:
      return {
        ...state,
        syncSessionsLoading: false,
        syncSessionsResult: action.failed ? "error" : "success",
      };
    default:
      return state;
  }
}
