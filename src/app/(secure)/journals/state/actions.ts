import { FETCH_JOURNALS, LOAD_JOURNALS } from "@/app/store/actionTypes";
import { api } from "@/lib/api";
import { Journal } from "./types";

export const getJournals = () => {
  return api
    .route("/api/journals")
    .fetch(() => ({ type: FETCH_JOURNALS }))
    .load((data: Journal[]) => ({ type: LOAD_JOURNALS, data }))
    .error("Error fetching journals")
    .get();
};
