import {
  FETCH_CHECKINS,
  LOAD_CHECKINS,
  FETCH_EDIT_CHECKIN,
  LOAD_EDIT_CHECKIN,
  FETCH_DELETE_CHECKIN,
  LOAD_DELETE_CHECKIN,
  FETCH_CHECKIN_ATTACHMENTS,
  LOAD_CHECKIN_ATTACHMENTS,
} from "../../../store/actionTypes";
import type { CheckInState, Action } from "./types";

const DEFAULT_STATE: CheckInState = {
  checkIns: null,
  checkInsLoading: false,
  editCheckInLoading: false,
  deleteCheckInLoading: false,
  attachments: [],
  attachmentsLoading: false,
  attachmentsId: null,
};

export default function checkInReducer(
  state = DEFAULT_STATE,
  action: Action
): CheckInState {
  switch (action.type) {
    case FETCH_CHECKINS:
      return {
        ...state,
        checkInsLoading: true,
      };
    case LOAD_CHECKINS:
      return {
        ...state,
        checkInsLoading: false,
        checkIns: action.data,
      };
    case FETCH_EDIT_CHECKIN:
      return {
        ...state,
        editCheckInLoading: true,
      };
    case LOAD_EDIT_CHECKIN:
      return {
        ...state,
        editCheckInLoading: false,
        checkIns: null,
      };
    case FETCH_DELETE_CHECKIN:
      return {
        ...state,
        deleteCheckInLoading: true,
      };
    case LOAD_DELETE_CHECKIN:
      return {
        ...state,
        deleteCheckInLoading: false,
        checkIns: state.checkIns
          ? state.checkIns.filter((checkIn) => checkIn.id !== action.id)
          : null,
        attachments: [],
        attachmentsId: null,
      };
    case FETCH_CHECKIN_ATTACHMENTS:
      return {
        ...state,
        attachmentsLoading: true,
      };
    case LOAD_CHECKIN_ATTACHMENTS:
      return {
        ...state,
        attachments: action.attachments,
        attachmentsLoading: false,
        attachmentsId: action.checkInId,
      };
    default:
      return state;
  }
}
