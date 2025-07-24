import {
  FETCH_INITIALIZE_SESSION,
  LOAD_INITIALIZE_SESSION,
  FETCH_APPS,
  LOAD_APPS,
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
    }
  | { type: typeof FETCH_APPS }
  | { type: typeof LOAD_APPS; data: App[] };

export interface AppState {
  apps: App[] | null;
  appsLoading: boolean;
  user: boolean;
  adminApps: App[] | null;
  adminAppsLoading: boolean;
}
