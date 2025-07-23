import {
  FETCH_APPS,
  LOAD_APPS,
  FETCH_INITIALIZE_USER,
  LOAD_INITIALIZE_USER,
} from "@/app/store/actionTypes";
import { api } from "@/lib/api";
import { App } from "./types";

export const getApps = () => {
  return api
    .route("/api/all/apps")
    .fetch(() => ({ type: FETCH_APPS }))
    .load((data: App[]) => ({ type: LOAD_APPS, data }))
    .error("Error fetching available apps")
    .get();
};

export const initializeUser = (id: string, email: string, name: string) => {
  return api
    .route("/api/all/user")
    .data({ id, email, name })
    .fetch(() => ({ type: FETCH_INITIALIZE_USER }))
    .load((data: any) => ({ type: LOAD_INITIALIZE_USER, data }))
    .error("Error initializing local user session")
    .post();
};
