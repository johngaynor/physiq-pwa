import {
  FETCH_JOURNALS,
  LOAD_JOURNALS,
  FETCH_UPSERT_JOURNAL,
  LOAD_UPSERT_JOURNAL,
} from "@/app/store/actionTypes";

export interface Journal {
  id: string;
  userId: string;
  title: string | null;
  content: any; // Changed to any to support Editor.js content object
  coachAccess: boolean;
  createdAt: string;
  lastUpdated: string;
}

// Action types
export type Action =
  | { type: typeof FETCH_JOURNALS }
  | { type: typeof LOAD_JOURNALS; data: Journal[] }
  | { type: typeof FETCH_UPSERT_JOURNAL }
  | { type: typeof LOAD_UPSERT_JOURNAL; data: Journal };

// State interface
export interface JournalsState {
  journals: Journal[] | null;
  journalsLoading: boolean;
}
