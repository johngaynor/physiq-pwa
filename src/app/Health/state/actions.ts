import {
  FETCH_HEALTH_DAILY_LOGS,
  LOAD_HEALTH_DAILY_LOGS,
  FETCH_EDIT_HEALTH_DAILY_WEIGHT,
  LOAD_EDIT_HEALTH_DAILY_WEIGHT,
  FETCH_EDIT_HEALTH_DAILY_STEPS,
  LOAD_EDIT_HEALTH_DAILY_STEPS,
  FETCH_HEALTH_SUPPLEMENTS,
  LOAD_HEALTH_SUPPLEMENTS,
  FETCH_HEALTH_SUPPLEMENT_LOGS,
  LOAD_HEALTH_SUPPLEMENT_LOGS,
  FETCH_TOGGLE_HEALTH_SUPPLEMENT_LOG,
  LOAD_TOGGLE_HEALTH_SUPPLEMENT_LOG,
  FETCH_EDIT_HEALTH_DAILY_BODYFAT,
  LOAD_EDIT_HEALTH_DAILY_BODYFAT,
  FETCH_EDIT_HEALTH_DAILY_WATER,
  LOAD_EDIT_HEALTH_DAILY_WATER,
  FETCH_EDIT_HEALTH_DAILY_CALORIES,
  LOAD_EDIT_HEALTH_DAILY_CALORIES,
  FETCH_EDIT_HEALTH_DAILY_SLEEP,
  LOAD_EDIT_HEALTH_DAILY_SLEEP,
  FETCH_HEALTH_DIET_LOGS,
  LOAD_HEALTH_DIET_LOGS,
} from "@/app/store/actionTypes";
import { api } from "@/lib/api";
import { DailyLog, DietLog, Supplement, SupplementLog } from "./types";

export const getDailyLogs = () => {
  return api
    .route("/api/health/daily")
    .fetch(() => ({ type: FETCH_HEALTH_DAILY_LOGS }))
    .load((data: DailyLog[]) => ({ type: LOAD_HEALTH_DAILY_LOGS, data }))
    .error("Error fetching daily health logs")
    .get();
};

export const editDailyWeight = (date: string, weight: number) => {
  return api
    .route("/api/health/daily/weight")
    .fetch(() => ({ type: FETCH_EDIT_HEALTH_DAILY_WEIGHT, date, weight }))
    .load(() => ({ type: LOAD_EDIT_HEALTH_DAILY_WEIGHT }))
    .error("Error editing daily weight log")
    .data({ date, weight })
    .post();
};

export const editDailySteps = (date: string, steps: number) => {
  return api
    .route("/api/health/daily/steps")
    .fetch(() => ({ type: FETCH_EDIT_HEALTH_DAILY_STEPS, date, steps }))
    .load(() => ({ type: LOAD_EDIT_HEALTH_DAILY_STEPS }))
    .error("Error editing daily steps log")
    .data({ date, steps })
    .post();
};

export const getSupplements = () => {
  return api
    .route("/api/health/supplements")
    .fetch(() => ({ type: FETCH_HEALTH_SUPPLEMENTS }))
    .load((data: Supplement[]) => ({ type: LOAD_HEALTH_SUPPLEMENTS, data }))
    .error("Error fetching health supplements")
    .get();
};

export const getSupplementLogs = () => {
  return api
    .route("/api/health/supplements/logs")
    .fetch(() => ({ type: FETCH_HEALTH_SUPPLEMENT_LOGS }))
    .load((data: SupplementLog[]) => ({
      type: LOAD_HEALTH_SUPPLEMENT_LOGS,
      data,
    }))
    .error("Error fetching health supplement logs")
    .get();
};

export const toggleSupplementLog = (
  date: string,
  supplementId: number,
  checked: boolean
) => {
  return api
    .route("/api/health/supplements/logs")
    .fetch(() => ({
      type: FETCH_TOGGLE_HEALTH_SUPPLEMENT_LOG,
      date,
      supplementId,
      checked,
    }))
    .load(() => ({
      type: LOAD_TOGGLE_HEALTH_SUPPLEMENT_LOG,
    }))
    .error("Error toggling health supplement log")
    .data({ date, supplementId, checked })
    .post();
};

export const editDailyBodyfat = (date: string, bodyfat: number) => {
  return api
    .route("/api/health/daily/bodyfat")
    .fetch(() => ({ type: FETCH_EDIT_HEALTH_DAILY_BODYFAT, date, bodyfat }))
    .load(() => ({ type: LOAD_EDIT_HEALTH_DAILY_BODYFAT }))
    .error("Error editing daily bodyfat log")
    .data({ date, bodyfat })
    .post();
};

export const editDailyWater = (date: string, water: number) => {
  return api
    .route("/api/health/daily/water")
    .fetch(() => ({ type: FETCH_EDIT_HEALTH_DAILY_WATER, date, water }))
    .load(() => ({ type: LOAD_EDIT_HEALTH_DAILY_WATER }))
    .error("Error editing daily water log")
    .data({ date, water })
    .post();
};

export const editDailyCalories = (date: string, calories: number) => {
  return api
    .route("/api/health/daily/calories")
    .fetch(() => ({ type: FETCH_EDIT_HEALTH_DAILY_CALORIES, date, calories }))
    .load(() => ({ type: LOAD_EDIT_HEALTH_DAILY_CALORIES }))
    .error("Error editing daily calories log")
    .data({ date, calories })
    .post();
};

// calls Oura API from Lambda function
export const getDailySleep = (date: string) => {
  return api
    .route(`/api/health/daily/sleep/oura/${date}`)
    .fetch(() => ({ type: FETCH_EDIT_HEALTH_DAILY_SLEEP }))
    .load((data) => ({ type: LOAD_EDIT_HEALTH_DAILY_SLEEP, data }))
    .error("Error getting daily sleep from oura")
    .get();
};

export const getDietLogs = () => {
  return api
    .route("/api/health/diet")
    .fetch(() => ({ type: FETCH_HEALTH_DIET_LOGS }))
    .load((data: DietLog[]) => ({ type: LOAD_HEALTH_DIET_LOGS, data }))
    .error("Error fetching diet logs")
    .get();
};
