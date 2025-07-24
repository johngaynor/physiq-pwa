import {
  FETCH_INITIALIZE_SESSION,
  LOAD_INITIALIZE_SESSION,
  FETCH_APPS,
  LOAD_APPS,
  FETCH_USERS,
  LOAD_USERS,
} from "@/app/store/actionTypes";
import { api } from "@/lib/api";
import { App, User } from "./types";

export const initializeSession = (id: string, email: string, name: string) => {
  return api
    .route("/api/all/session")
    .data({ id, email, name })
    .fetch(() => ({ type: FETCH_INITIALIZE_SESSION }))
    .load((data: { user: any; existed: boolean; apps: App[] }) => ({
      type: LOAD_INITIALIZE_SESSION,
      user: data.user,
      existed: data.existed,
      apps: data.apps,
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
