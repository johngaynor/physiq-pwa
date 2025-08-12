import { FETCH_EXERCISES, LOAD_EXERCISES } from "@/app/store/actionTypes";
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
