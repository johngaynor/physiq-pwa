import {
  FETCH_INITIALIZE_SESSION,
  LOAD_INITIALIZE_SESSION,
} from "@/app/store/actionTypes";
import { api } from "@/lib/api";
import { App } from "./types";

export const initializeSession = (id: string, email: string, name: string) => {
  return api
    .route("/api/all/session")
    .data({ id, email, name })
    .fetch(() => ({ type: FETCH_INITIALIZE_SESSION }))
    .load((data: { apps: App[]; user: any; existed: boolean }) => ({
      type: LOAD_INITIALIZE_SESSION,
      data: data.user,
      apps: data.apps,
      existed: data.existed,
    }))
    .error("Error initializing session")
    .post();
};
