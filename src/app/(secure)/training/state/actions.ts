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
} from "@/app/store/actionTypes";
import { api } from "@/lib/api";
import { Exercise, Gym } from "./types";

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

export const editGym = (id: number | null, name: string, address: string) => {
  return api
    .route("/api/training/gyms/gym")
    .data({ id, name, address })
    .fetch(() => ({ type: FETCH_EDIT_GYM }))
    .load(() => ({
      type: LOAD_EDIT_GYM,
      data: { id, name, address },
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
