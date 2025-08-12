import {
  FETCH_EXERCISES,
  LOAD_EXERCISES,
  FETCH_EDIT_EXERCISE,
  LOAD_EDIT_EXERCISE,
  FETCH_DELETE_EXERCISE,
  LOAD_DELETE_EXERCISE,
} from "@/app/store/actionTypes";
import { api } from "@/lib/api";
import { Exercise } from "./types";

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
