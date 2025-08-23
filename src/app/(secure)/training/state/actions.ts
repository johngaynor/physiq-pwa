import {
  FETCH_EXERCISES,
  LOAD_EXERCISES,
  FETCH_EDIT_EXERCISE,
  LOAD_EDIT_EXERCISE,
  FETCH_DELETE_EXERCISE,
  LOAD_DELETE_EXERCISE,
  FETCH_EXERCISE_UNITS,
  LOAD_EXERCISE_UNITS,
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
} from "@/app/store/actionTypes";
import { api } from "@/lib/api";
import { Exercise, ExerciseUnit, Gym, GymPhotos, Review } from "./types";

export const getExercises = () => {
  return api
    .route("/api/training/exercises")
    .fetch(() => ({ type: FETCH_EXERCISES }))
    .load((data: Exercise[]) => ({
      type: LOAD_EXERCISES,
      data,
    }))
    .error("Error fetching exercises")
    .get();
};

export const editExercise = (id: number | null, name: string) => {
  return api
    .route("/api/training/exercises/exercise")
    .data({ id, name })
    .fetch(() => ({ type: FETCH_EDIT_EXERCISE }))
    .load(() => ({
      type: LOAD_EDIT_EXERCISE,
      data: { id, name },
    }))
    .error("Error error editing exercise")
    .post();
};

export const deleteExercise = (id: number) => {
  return api
    .route(`/api/training/exercises/exercise/${id}`)
    .fetch(() => ({ type: FETCH_DELETE_EXERCISE }))
    .load(() => ({
      type: LOAD_DELETE_EXERCISE,
      id,
    }))
    .error("Error deleting exercise")
    .delete();
};

export const getExerciseUnits = () => {
  return api
    .route("/api/training/exercises/units")
    .fetch(() => ({ type: FETCH_EXERCISE_UNITS }))
    .load((data: ExerciseUnit[]) => ({
      type: LOAD_EXERCISE_UNITS,
      data,
    }))
    .error("Error fetching exercise units")
    .get();
};

export const getGyms = () => {
  return api
    .route("/api/training/gyms")
    .fetch(() => ({ type: FETCH_GYMS }))
    .load((data: Gym[]) => ({
      type: LOAD_GYMS,
      data,
    }))
    .error("Error fetching gyms")
    .get();
};

export const editGym = (gymData: Partial<Gym> & { id?: number | null }) => {
  return api
    .route("/api/training/gyms/gym")
    .data(gymData)
    .fetch(() => ({ type: FETCH_EDIT_GYM }))
    .load(() => ({
      type: LOAD_EDIT_GYM,
      data: gymData,
    }))
    .error("Error editing gym")
    .post();
};

export const deleteGym = (id: number) => {
  return api
    .route(`/api/training/gyms/gym/${id}`)
    .fetch(() => ({ type: FETCH_DELETE_GYM }))
    .load(() => ({
      type: LOAD_DELETE_GYM,
      id,
    }))
    .error("Error deleting gym")
    .delete();
};

export const getGymPhotos = (gymId: number) => {
  return api
    .route(`/api/training/gyms/photos/${gymId}`)
    .fetch(() => ({ type: FETCH_GYM_PHOTOS, gymId }))
    .load((photos: GymPhotos[]) => ({
      type: LOAD_GYM_PHOTOS,
      gymId,
      photos,
    }))
    .error("Error fetching gym photos")
    .get();
};

export const uploadGymPhotos = (formData: FormData) => {
  return api
    .route("/api/training/gyms/photos")
    .data(formData)
    .fetch(() => ({ type: FETCH_UPLOAD_GYM_PHOTOS }))
    .load(() => ({
      type: LOAD_UPLOAD_GYM_PHOTOS,
    }))
    .error("Error uploading gym photos")
    .post();
};

export const deleteGymPhoto = (photoId: number) => {
  return api
    .route(`/api/training/gyms/photos/${photoId}`)
    .fetch(() => ({ type: FETCH_DELETE_GYM_PHOTO }))
    .load(() => ({
      type: LOAD_DELETE_GYM_PHOTO,
      photoId,
    }))
    .error("Error deleting gym photo")
    .delete();
};

export const syncSessions = (records: any) => {
  return api
    .route("/api/training/train/sync")
    .data({ records })
    .fetch(() => ({ type: FETCH_TRAINING_SESSION_SYNCS }))
    .load(() => ({
      type: LOAD_TRAINING_SESSION_SYNCS,
      failed: false,
    }))
    .onFail(() => ({
      type: LOAD_TRAINING_SESSION_SYNCS,
      failed: true,
    }))
    .error("Error syncing sessions")
    .post();
};

export const editGymReview = ({
  id,
  gymId,
  rating,
  review,
}: {
  id: number | null;
  gymId: number;
  rating: number;
  review: string;
}) => {
  return api
    .route("/api/training/gyms/review")
    .data({ id, gymId, rating, review })
    .fetch(() => ({ type: FETCH_EDIT_GYM_REVIEW }))
    .load((data: Review) => ({
      type: LOAD_EDIT_GYM_REVIEW,
      gymId,
      review: data,
    }))
    .error("Error editing gym review")
    .post();
};
