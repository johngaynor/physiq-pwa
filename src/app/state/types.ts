import { FETCH_APPS, LOAD_APPS } from "../store/actionTypes";

export type App = {
  id: number;
  name: string;
  route: string;
};

// action types
export type Action =
  | { type: typeof FETCH_APPS }
  | { type: typeof LOAD_APPS; data: App[] };

export interface AppState {
  apps: App[] | null;
  appsLoading: boolean;
}
