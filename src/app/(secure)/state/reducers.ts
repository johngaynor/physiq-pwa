import {
  FETCH_INITIALIZE_SESSION,
  LOAD_INITIALIZE_SESSION,
  FETCH_APPS,
  LOAD_APPS,
  FETCH_USERS,
  LOAD_USERS,
} from "../../store/actionTypes";
import type { AppState, Action } from "./types";

const DEFAULT_STATE: AppState = {
  apps: null,
  appsLoading: false,
  user: false,
  adminApps: null,
  adminAppsLoading: false,
  users: null,
  usersLoading: false,
};

export default function appReducer(
  state = DEFAULT_STATE,
  action: Action
): AppState {
  switch (action.type) {
    case FETCH_INITIALIZE_SESSION:
      return { ...state, appsLoading: true };
    case LOAD_INITIALIZE_SESSION:
      return {
        ...state,
        user: true,
        apps: action.apps,
        appsLoading: false,
      };
    case FETCH_APPS:
      return { ...state, adminAppsLoading: true };
    case LOAD_APPS:
      return {
        ...state,
        adminApps: action.data,
        adminAppsLoading: false,
      };
    case FETCH_USERS:
      return {
        ...state,
        usersLoading: true,
      };
    case LOAD_USERS:
      return { ...state, usersLoading: false, users: action.data };
    default:
      return state;
  }
}
