import {
  FETCH_EXERCISES,
  LOAD_EXERCISES,
  FETCH_EDIT_EXERCISE,
  LOAD_EDIT_EXERCISE,
  FETCH_DELETE_EXERCISE,
  LOAD_DELETE_EXERCISE,
} from "../../../store/actionTypes";

export type Exercise = {
  id: number;
  name: string;
};

// action types
export type Action =
  | { type: typeof FETCH_EXERCISES }
  | { type: typeof LOAD_EXERCISES; data: Exercise[] }
  | { type: typeof FETCH_EDIT_EXERCISE }
  | {
      type: typeof LOAD_EDIT_EXERCISE;
      data: Exercise;
    }
  | { type: typeof FETCH_DELETE_EXERCISE }
  | { type: typeof LOAD_DELETE_EXERCISE; id: number };

export interface TrainingState {
  exercises: null | Exercise[];
  exercisesLoading: boolean;
}
