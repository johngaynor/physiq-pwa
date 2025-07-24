import {
  FETCH_INITIALIZE_SESSION,
  LOAD_INITIALIZE_SESSION,
  FETCH_APPS,
  LOAD_APPS,
  FETCH_USERS,
  LOAD_USERS,
} from "../../store/actionTypes";

export type App = {
  id: number;
  name: string;
  description: string;
  link: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  admin: boolean;
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
  | { type: typeof LOAD_APPS; data: App[] }
  | { type: typeof FETCH_USERS }
  | { type: typeof LOAD_USERS; data: User[] };

export interface AppState {
  apps: App[] | null;
  appsLoading: boolean;
  user: boolean;
  adminApps: App[] | null;
  adminAppsLoading: boolean;
  users: User[] | null;
  usersLoading: boolean;
}
