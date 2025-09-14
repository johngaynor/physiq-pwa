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
  TOGGLE_APP_FAVORITE,
} from "@/app/store/actionTypes";
import { api } from "@/lib/api";
import { App, User } from "./types";

export const initializeSession = (id: string, email: string, name: string) => {
  return api
    .route("/api/all/session")
    .data({ id, email, name })
    .fetch(() => ({ type: FETCH_INITIALIZE_SESSION }))
    .load((data: { user: User; existed: boolean }) => ({
      type: LOAD_INITIALIZE_SESSION,
      user: data.user,
      existed: data.existed,
    }))
    .error("Error initializing session")
    .post();
};

export const getApps = () => {
  return api
    .route("/api/all/apps")
    .fetch(() => ({ type: FETCH_APPS }))
    .load((data: App[]) => ({
      type: LOAD_APPS,
      data,
    }))
    .error("Error fetching apps")
    .get();
};

export const getUsers = () => {
  return api
    .route("/api/all/users")
    .fetch(() => ({ type: FETCH_USERS }))
    .load((data: User[]) => ({
      type: LOAD_USERS,
      data,
    }))
    .error("Error fetching users")
    .get();
};

export const getAppAccess = (userId: string) => {
  return api
    .route(`/api/all/app/access/${userId}`)
    .fetch(() => ({ type: FETCH_APP_ACCESS }))
    .load((data: { appAccess: App[]; appAccessId: string }) => ({
      type: LOAD_APP_ACCESS,
      data,
      userId,
    }))
    .error("Error fetching app access")
    .get();
};

export const editAppAccess = (userId: string, app: App, checked: boolean) => {
  return api
    .route("/api/all/app/access")
    .data({ userId, app, checked })
    .load(() => ({
      type: EDIT_APP_ACCESS,
      data: { userId, app, checked },
    }))
    .error("Error editing app access")
    .post();
};

export const toggleAppFavorite = (userId: string, appId: number) => {
  return api
    .route("/api/all/app/favorite")
    .data({ userId, appId })
    .fetch(() => ({ type: TOGGLE_APP_FAVORITE, appId }))
    .error("Error toggling app favorite")
    .post();
};
