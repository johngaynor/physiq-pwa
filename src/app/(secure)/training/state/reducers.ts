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
  FETCH_TRAINING_SESSION_SYNCS,
  LOAD_TRAINING_SESSION_SYNCS,
} from "../../../store/actionTypes";
import type { TrainingState, Action } from "./types";

const DEFAULT_STATE: TrainingState = {
  exercises: null,
  exercisesLoading: false,
  exerciseUnits: null,
  exerciseUnitsLoading: false,
  gyms: null,
  gymsLoading: false,
  syncSessionsLoading: false,
  syncSessionsResult: "idle",
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
    case FETCH_EXERCISE_UNITS:
      return { ...state, exerciseUnitsLoading: true };
    case LOAD_EXERCISE_UNITS:
      return {
        ...state,
        exerciseUnits: action.data,
        exerciseUnitsLoading: false,
      };
    case FETCH_GYMS:
      return { ...state, gymsLoading: true };
    case LOAD_GYMS:
      return {
        ...state,
        gyms: action.data,
        gymsLoading: false,
      };
    case FETCH_EDIT_GYM:
      return { ...state, gymsLoading: true };
    case LOAD_EDIT_GYM:
      return {
        ...state,
        gyms: state.gyms
          ? state.gyms.some((g) => g.id === action.data.id)
            ? state.gyms.map((g) => (g.id === action.data.id ? action.data : g))
            : [...state.gyms, action.data]
          : [action.data],
        gymsLoading: false,
      };
    case FETCH_DELETE_GYM:
      return { ...state, gymsLoading: true };
    case LOAD_DELETE_GYM:
      return {
        ...state,
        gyms: state.gyms?.filter((gym) => gym.id !== action.id) || [],
        gymsLoading: false,
      };
    case FETCH_TRAINING_SESSION_SYNCS:
      return {
        ...state,
        syncSessionsLoading: true,
        syncSessionsResult: "idle",
      };
    case LOAD_TRAINING_SESSION_SYNCS:
      return {
        ...state,
        syncSessionsLoading: false,
        syncSessionsResult: action.failed ? "error" : "success",
      };
    default:
      return state;
  }
}
