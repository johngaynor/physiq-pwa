import {
  FETCH_JOURNALS,
  LOAD_JOURNALS,
  FETCH_UPSERT_JOURNAL,
  LOAD_UPSERT_JOURNAL,
} from "@/app/store/actionTypes";
import { api } from "@/lib/api";
import { Journal } from "./types";
import { OutputData } from "@editorjs/editorjs";

export const getJournals = () => {
  return api
    .route("/api/journals")
    .fetch(() => ({ type: FETCH_JOURNALS }))
    .load((data: Journal[]) => ({ type: LOAD_JOURNALS, data }))
    .error("Error fetching journals")
    .get();
};

export interface UpsertJournalData {
  id: string;
  title: string;
  content: OutputData;
}

export const upsertJournal = (journalData: UpsertJournalData) => {
  return api
    .route("/api/journals/journal")
    .data(journalData)
    .fetch(() => ({ type: FETCH_UPSERT_JOURNAL }))
    .load((data: Journal) => ({ type: LOAD_UPSERT_JOURNAL, data }))
    .error("Error saving journal")
    .post();
};
