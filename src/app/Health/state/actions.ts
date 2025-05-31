import { api } from "@/lib/api";
import { DailyLog } from "./types";

export const getDailyLogs = () => {
  return api
    .route("/health/logs/daily")
    .fetch(() => ({ type: "FETCH_HEALTH_DAILY_LOGS" }))
    .load((data: DailyLog[]) => ({ type: "LOAD_HEALTH_DAILY_LOGS", data }))
    .error("Error fetching daily health logs")
    .get();
};
