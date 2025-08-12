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
} from "../../../store/actionTypes";

export type Exercise = {
  id: number;
  name: string;
};

export type Gym = {
  id: number;
  name: string;
  address: string;
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
  | { type: typeof LOAD_DELETE_EXERCISE; id: number }
  | { type: typeof FETCH_GYMS }
  | { type: typeof LOAD_GYMS; data: Gym[] }
  | { type: typeof FETCH_EDIT_GYM }
  | {
      type: typeof LOAD_EDIT_GYM;
      data: Gym;
    }
  | { type: typeof FETCH_DELETE_GYM }
  | { type: typeof LOAD_DELETE_GYM; id: number };

export interface TrainingState {
  exercises: null | Exercise[];
  exercisesLoading: boolean;
  gyms: null | Gym[];
  gymsLoading: boolean;
}
