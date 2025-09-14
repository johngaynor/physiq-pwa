import {
  FETCH_JOURNALS,
  LOAD_JOURNALS,
  FETCH_UPSERT_JOURNAL,
  LOAD_UPSERT_JOURNAL,
} from "../../../store/actionTypes";
import { JournalsState, Action } from "./types";

const initialState: JournalsState = {
  journals: null,
  journalsLoading: false,
};

export default function journalsReducer(
  state: JournalsState = initialState,
  action: Action
): JournalsState {
  switch (action.type) {
    case FETCH_JOURNALS:
      return {
        ...state,
        journalsLoading: true,
      };

    case LOAD_JOURNALS:
      return {
        ...state,
        journalsLoading: false,
        journals: action.data,
      };

    case FETCH_UPSERT_JOURNAL:
      return {
        ...state,
        journalsLoading: true,
      };

    case LOAD_UPSERT_JOURNAL:
      const updatedJournal = action.data;
      const currentJournals = state.journals || [];

      // Check if journal exists and update it, or add it if it's new
      const existingIndex = currentJournals.findIndex(
        (j) => j.id === updatedJournal.id
      );

      let updatedJournals;
      if (existingIndex >= 0) {
        // Update existing journal
        updatedJournals = [...currentJournals];
        updatedJournals[existingIndex] = updatedJournal;
      } else {
        // Add new journal
        updatedJournals = [updatedJournal, ...currentJournals];
      }

      return {
        ...state,
        journalsLoading: false,
        journals: updatedJournals,
      };

    default:
      return state;
  }
}
