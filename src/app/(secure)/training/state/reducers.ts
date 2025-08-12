import { FETCH_EXERCISES, LOAD_EXERCISES } from "../../../store/actionTypes";
import type { TrainingState, Action } from "./types";

const DEFAULT_STATE: TrainingState = {
  exercises: null,
  exercisesLoading: false,
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
    default:
      return state;
  }
}
