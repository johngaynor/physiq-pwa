import { FETCH_SLEEP_LOGS, LOAD_SLEEP_LOGS } from "@/app/store/actionTypes";
import { api } from "@/lib/api";
import { SleepLog } from "./types";

export const getSleepLogs = () => {
  return api
    .route("/api/sleep/logs")
    .fetch(() => ({ type: FETCH_SLEEP_LOGS }))
    .load((data: SleepLog[]) => ({ type: LOAD_SLEEP_LOGS, data }))
    .error("Error fetching sleep logs")
    .get();
};
