import { FETCH_JOURNALS, LOAD_JOURNALS } from "../../../store/actionTypes";
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

    default:
      return state;
  }
}
