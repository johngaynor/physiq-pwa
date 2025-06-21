import {
  FETCH_DIET_LOGS,
  LOAD_DIET_LOGS,
  FETCH_EDIT_DIET_LOG,
  LOAD_EDIT_DIET_LOG,
} from "@/app/store/actionTypes";
import { api } from "@/lib/api";
import { DietLog } from "./types";

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
