import { FETCH_APPS, LOAD_APPS } from "@/app/store/actionTypes";
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
