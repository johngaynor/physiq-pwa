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

export const editCheckIn = (values: CheckIn, files?: File[]) => {
  const formData = new FormData();

  // Add the checkin data as individual fields
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(
        key,
        typeof value === "object" ? JSON.stringify(value) : String(value)
      );
    }
  });

  // Add files with the field name "images"
  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append("images", file);
    });
  }

  return api
    .route("/api/checkins")
    .fetch(() => ({ type: FETCH_EDIT_CHECKIN }))
    .load((data: { existing: boolean; checkIn: CheckIn }) => ({
      type: LOAD_EDIT_CHECKIN,
      data,
    }))
    .error("Error editing checkin")
    .data(formData)
    .post();
};

export const deleteCheckIn = (id: number) => {
  return api
    .route(`/api/checkins/${id}`)
    .fetch(() => ({ type: FETCH_DELETE_CHECKIN }))
    .load(() => ({
      type: LOAD_DELETE_CHECKIN,
      id,
    }))
    .error("Error deleting checkin")
    .delete();
};
