import {
  FETCH_CHECKINS,
  LOAD_CHECKINS,
  FETCH_EDIT_CHECKIN,
  LOAD_EDIT_CHECKIN,
  FETCH_DELETE_CHECKIN,
  LOAD_DELETE_CHECKIN,
} from "@/app/store/actionTypes";
import { api } from "@/lib/api";
import { CheckIn } from "./types";

export const getCheckIns = () => {
  return api
    .route("/api/checkins")
    .fetch(() => ({ type: FETCH_CHECKINS }))
    .load((data: CheckIn[]) => ({ type: LOAD_CHECKINS, data }))
    .error("Error fetching checkins")
    .get();
};

export const editCheckIn = (values: CheckIn) => {
  return api
    .route("/api/checkin")
    .fetch(() => ({ type: FETCH_EDIT_CHECKIN }))
    .load((data: { existing: boolean; checkIn: CheckIn }) => ({
      type: LOAD_EDIT_CHECKIN,
      data,
    }))
    .error("Error editing checkin")
    .data(values)
    .post();
};

export const deleteCheckIn = (id: number) => {
  return api
    .route(`/api/checkin/${id}`)
    .fetch(() => ({ type: FETCH_DELETE_CHECKIN }))
    .load(() => ({
      type: LOAD_DELETE_CHECKIN,
      id,
    }))
    .error("Error deleting checkin")
    .delete();
};
