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
import type { AppState, Action } from "./types";

const DEFAULT_STATE: AppState = {
  user: null,
  userLoading: false,
  apps: null,
  appsLoading: false,
  appAccess: null,
  appAccessLoading: false,
  appAccessId: null,
  users: null,
  usersLoading: false,
};

export default function appReducer(
  state = DEFAULT_STATE,
  action: Action
): AppState {
  switch (action.type) {
    case FETCH_INITIALIZE_SESSION:
      return { ...state, userLoading: true };
    case LOAD_INITIALIZE_SESSION:
      return {
        ...state,
        user: action.user,
        userLoading: false,
      };
    case FETCH_APPS:
      return { ...state, appsLoading: true };
    case LOAD_APPS:
      return {
        ...state,
        apps: action.data,
        appsLoading: false,
      };
    case FETCH_APP_ACCESS:
      return {
        ...state,
        appAccessLoading: true,
      };
    case LOAD_APP_ACCESS:
      return {
        ...state,
        appAccess: action.data,
        appAccessLoading: false,
        appAccessId: action.userId,
      };
    case FETCH_USERS:
      return {
        ...state,
        usersLoading: true,
      };
    case LOAD_USERS:
      return { ...state, usersLoading: false, users: action.data };
    case EDIT_APP_ACCESS: {
      const { app, checked } = action.data;
      if (checked) {
        return {
          ...state,
          appAccess: [...(state.appAccess || []), app],
        };
      } else {
        return {
          ...state,
          appAccess: state.appAccess?.filter((a) => a.id !== app.id) || [],
        };
      }
    }
    default:
      return state;
  }
}
