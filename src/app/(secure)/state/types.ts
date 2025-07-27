import {
  FETCH_INITIALIZE_SESSION,
  LOAD_INITIALIZE_SESSION,
  FETCH_APPS,
  LOAD_APPS,
  FETCH_USERS,
  LOAD_USERS,
  FETCH_APP_ACCESS,
  LOAD_APP_ACCESS,
  EDIT_APP_ACCESS,
} from "../../store/actionTypes";

export type App = {
  id: number;
  name: string;
  description: string;
  link: string;
  allUsers: number;
  restricted: number;
};

// will eventually store coach-client relationships here
export type User = {
  id: string;
  name: string;
  email: string;
  // admin: boolean;
  apps: App[];
};

// action types
export type Action =
  | { type: typeof FETCH_INITIALIZE_SESSION }
  | {
      type: typeof LOAD_INITIALIZE_SESSION;
      user: User;
      existed: boolean;
    }
  | { type: typeof FETCH_APPS }
  | { type: typeof LOAD_APPS; data: App[] }
  | { type: typeof FETCH_APP_ACCESS }
  | { type: typeof LOAD_APP_ACCESS; data: App[]; userId: string }
  | { type: typeof FETCH_USERS }
  | { type: typeof LOAD_USERS; data: User[] }
  | {
      type: typeof EDIT_APP_ACCESS;
      data: { userId: string; app: App; checked: boolean };
    };

export interface AppState {
  user: User | null;
  userLoading: boolean;
  apps: App[] | null;
  appsLoading: boolean;
  appAccess: App[] | null;
  appAccessLoading: boolean;
  appAccessId: string | null;
  users: User[] | null;
  usersLoading: boolean;
}
