import {
  FETCH_CHECKINS,
  LOAD_CHECKINS,
  FETCH_EDIT_CHECKIN,
  LOAD_EDIT_CHECKIN,
  FETCH_DELETE_CHECKIN,
  LOAD_DELETE_CHECKIN,
} from "../../../store/actionTypes";
import type { CheckInState, Action } from "./types";

const DEFAULT_STATE: CheckInState = {
  checkIns: null,
  checkInsLoading: false,
  editCheckInLoading: false,
  deleteCheckInLoading: false,
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
      console.log(action.data);
      if (action.data.existing) {
        return {
          ...state,
          editCheckInLoading: false,
          checkIns:
            state.checkIns?.map((checkIn) =>
              checkIn.id === action.data.checkIn.id
                ? action.data.checkIn
                : checkIn
            ) || null,
        };
      } else
        return {
          ...state,
          editCheckInLoading: false,
          checkIns: state.checkIns
            ? [...state.checkIns, action.data.checkIn]
            : [action.data.checkIn],
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
      };
    default:
      return state;
  }
}
