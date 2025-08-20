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
  FETCH_TRAINING_SESSION_SYNCS,
  LOAD_TRAINING_SESSION_SYNCS,
  FETCH_EXERCISE_UNITS,
  LOAD_EXERCISE_UNITS,
  FETCH_GYM_PHOTOS,
  LOAD_GYM_PHOTOS,
} from "../../../store/actionTypes";

export type Exercise = {
  id: number;
  name: string;
  target?: string;
  defaultPrimaryUnit?: number;
  defaultSecondaryUnit?: number;
};

export type GymPhotos = {
  id?: number;
  gymId?: number;
  s3Filename?: string;
  url?: string;
  filename?: string;
  blob?: {
    contentType: string;
    data: string;
    lastModified: string;
    size: number;
  };
};

export type Gym = {
  id: number;
  name: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  fullAddress: string;
  latitude: number | null;
  longitude: number | null;
  createdBy: string | null;
  lastUpdated: string;
};

export type ExerciseUnit = {
  id: number;
  name: string;
  measurement: string;
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
  | { type: typeof LOAD_DELETE_GYM; id: number }
  | { type: typeof FETCH_EXERCISE_UNITS }
  | { type: typeof LOAD_EXERCISE_UNITS; data: ExerciseUnit[] }
  | { type: typeof FETCH_GYM_PHOTOS; gymId: number }
  | {
      type: typeof LOAD_GYM_PHOTOS;
      gymId: number;
      photos: GymPhotos[];
    }
  | { type: typeof FETCH_TRAINING_SESSION_SYNCS }
  | { type: typeof LOAD_TRAINING_SESSION_SYNCS; failed?: boolean };

export interface TrainingState {
  exercises: null | Exercise[];
  exercisesLoading: boolean;
  exerciseUnits: null | ExerciseUnit[];
  exerciseUnitsLoading: boolean;
  gyms: null | Gym[];
  gymsLoading: boolean;
  gymPhotos: GymPhotos[];
  gymPhotosLoading: boolean;
  gymPhotosId: number | null;
  syncSessionsLoading: boolean;
  syncSessionsResult: "success" | "error" | "idle";
}
