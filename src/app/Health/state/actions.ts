import {
  FETCH_HEALTH_DAILY_LOGS,
  LOAD_HEALTH_DAILY_LOGS,
  FETCH_EDIT_HEALTH_DAILY_WEIGHT,
  LOAD_EDIT_HEALTH_DAILY_WEIGHT,
  FETCH_EDIT_HEALTH_DAILY_STEPS,
  LOAD_EDIT_HEALTH_DAILY_STEPS,
} from "@/app/store/actionTypes";
import { api } from "@/lib/api";
import { DailyLog } from "./types";

export const getDailyLogs = () => {
  return api
    .route("/api/health/logs/daily")
    .fetch(() => ({ type: FETCH_HEALTH_DAILY_LOGS }))
    .load((data: DailyLog[]) => ({ type: LOAD_HEALTH_DAILY_LOGS, data }))
    .error("Error fetching daily health logs")
    .get();
};

export const editDailyWeight = (date: string, weight: number) => {
  return api
    .route("/api/health/logs/daily/weight")
    .fetch(() => ({ type: FETCH_EDIT_HEALTH_DAILY_WEIGHT, date, weight }))
    .load(() => ({ type: LOAD_EDIT_HEALTH_DAILY_WEIGHT }))
    .error("Error editing daily weight log")
    .data({ date, weight })
    .post();
};

export const editDailySteps = (date: string, steps: number) => {
  return api
    .route("/api/health/logs/daily/steps")
    .fetch(() => ({ type: FETCH_EDIT_HEALTH_DAILY_STEPS, date, steps }))
    .load(() => ({ type: LOAD_EDIT_HEALTH_DAILY_STEPS }))
    .error("Error editing daily steps log")
    .data({ date, steps })
    .post();
};
