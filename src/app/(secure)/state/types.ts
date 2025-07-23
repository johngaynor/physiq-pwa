import {
  FETCH_APPS,
  LOAD_APPS,
  FETCH_INITIALIZE_USER,
  LOAD_INITIALIZE_USER,
} from "../../store/actionTypes";

export type App = {
  id: number;
  name: string;
  description: string;
  link: string;
};

// action types
export type Action =
  | { type: typeof FETCH_APPS }
  | { type: typeof LOAD_APPS; data: App[] }
  | { type: typeof FETCH_INITIALIZE_USER }
  | { type: typeof LOAD_INITIALIZE_USER; data: any };

export interface AppState {
  apps: App[] | null;
  appsLoading: boolean;
  user: boolean;
}
