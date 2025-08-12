import {
  FETCH_EXERCISES,
  LOAD_EXERCISES,
  FETCH_EDIT_EXERCISE,
  LOAD_EDIT_EXERCISE,
  FETCH_DELETE_EXERCISE,
  LOAD_DELETE_EXERCISE,
} from "../../../store/actionTypes";
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
    case FETCH_EDIT_EXERCISE:
      return { ...state, exercisesLoading: true };
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
        exercisesLoading: false,
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
    default:
      return state;
  }
}
