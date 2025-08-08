import {
  FETCH_DIET_LOGS,
  LOAD_DIET_LOGS,
  FETCH_EDIT_DIET_LOG,
  LOAD_EDIT_DIET_LOG,
  FETCH_DELETE_DIET_LOG,
  LOAD_DELETE_DIET_LOG,
  FETCH_HEALTH_DIET_LOGS_LATEST,
  LOAD_HEALTH_DIET_LOGS_LATEST,
} from "@/app/store/actionTypes";
import { api } from "@/lib/api";
import { DietLog, DashboardDietLog } from "./types";

export const getDietLogs = () => {
  return api
    .route("/api/diet/logs")
    .fetch(() => ({ type: FETCH_DIET_LOGS }))
    .load((data: DietLog[]) => ({ type: LOAD_DIET_LOGS, data }))
    .error("Error fetching diet logs")
    .get();
};

export const editDietLog = (values: DietLog) => {
  return api
    .route("/api/diet/log")
    .fetch(() => ({ type: FETCH_EDIT_DIET_LOG }))
    .load((data: { existing: boolean; log: DietLog }) => ({
      type: LOAD_EDIT_DIET_LOG,
      data,
    }))
    .error("Error editing diet log")
    .data(values)
    .post();
};

export const deleteDietLog = (id: number) => {
  return api
    .route(`/api/diet/log/${id}`)
    .fetch(() => ({ type: FETCH_DELETE_DIET_LOG }))
    .load(() => ({
      type: LOAD_DELETE_DIET_LOG,
      id,
    }))
    .error("Error deleting diet log")
    .delete();
};

export const getLatestDietLog = () => {
  return api
    .route("/api/diet/log/latest")
    .fetch(() => ({ type: FETCH_HEALTH_DIET_LOGS_LATEST }))
    .load((data: DashboardDietLog) => ({
      type: LOAD_HEALTH_DIET_LOGS_LATEST,
      data,
    }))
    .error("Error fetching diet logs")
    .get();
};
