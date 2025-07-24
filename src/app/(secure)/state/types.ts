import {
  FETCH_INITIALIZE_SESSION,
  LOAD_INITIALIZE_SESSION,
} from "../../store/actionTypes";

export type App = {
  id: number;
  name: string;
  description: string;
  link: string;
};

// action types
export type Action =
  | { type: typeof FETCH_INITIALIZE_SESSION }
  | {
      type: typeof LOAD_INITIALIZE_SESSION;
      user: any;
      existed: boolean;
      apps: App[];
    };

export interface AppState {
  apps: App[] | null;
  appsLoading: boolean;
  user: boolean;
}
