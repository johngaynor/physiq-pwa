import { FETCH_DIET_LOGS, LOAD_DIET_LOGS } from "@/app/store/actionTypes";
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
