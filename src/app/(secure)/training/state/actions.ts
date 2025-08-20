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
  FETCH_TRAINING_SESSION_SYNCS,
  LOAD_TRAINING_SESSION_SYNCS,
} from "@/app/store/actionTypes";
import { api } from "@/lib/api";
import { Exercise, ExerciseUnit, Gym, GymPhotos } from "./types";

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
