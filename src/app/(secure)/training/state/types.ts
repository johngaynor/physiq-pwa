import { FETCH_EXERCISES, LOAD_EXERCISES } from "../../../store/actionTypes";

export type Exercise = {
  id: number;
  name: string;
};

// action types
export type Action =
  | { type: typeof FETCH_EXERCISES }
  | { type: typeof LOAD_EXERCISES; data: Exercise[] };

export interface TrainingState {
  exercises: null | Exercise[];
  exercisesLoading: boolean;
}
