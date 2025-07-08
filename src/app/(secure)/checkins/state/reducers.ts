import {
  FETCH_CHECKINS,
  LOAD_CHECKINS,
  FETCH_EDIT_CHECKIN,
  LOAD_EDIT_CHECKIN,
  FETCH_DELETE_CHECKIN,
  LOAD_DELETE_CHECKIN,
  FETCH_CHECKIN_ATTACHMENTS,
  LOAD_CHECKIN_ATTACHMENTS,
  FETCH_POSES,
  LOAD_POSES,
  FETCH_ASSIGN_CHECKIN_POSE,
  LOAD_ASSIGN_CHECKIN_POSE,
  FETCH_CHECKIN_COMMENTS,
  LOAD_CHECKIN_COMMENTS,
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
  poses: null,
  posesLoading: false,
  assignPoseLoading: false,
  comments: [],
  commentsLoading: false,
  commentsId: null,
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
        attachmentsId: null,
        commentsId: null,
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
    case FETCH_POSES:
      return {
        ...state,
        posesLoading: true,
      };
    case LOAD_POSES:
      return {
        ...state,
        posesLoading: false,
        poses: action.data,
      };
    case FETCH_ASSIGN_CHECKIN_POSE:
      return {
        ...state,
        assignPoseLoading: true,
      };
    case LOAD_ASSIGN_CHECKIN_POSE:
      return {
        ...state,
        assignPoseLoading: false,
        // Update the attachment in the attachments array with the new poseId
        attachments: state.attachments.map((attachment) =>
          attachment.id === action.attachmentId
            ? { ...attachment, poseId: action.poseId }
            : attachment
        ),
      };
    case FETCH_CHECKIN_COMMENTS:
      return {
        ...state,
        commentsLoading: true,
      };
    case LOAD_CHECKIN_COMMENTS:
      return {
        ...state,
        comments: action.comments,
        commentsLoading: false,
        commentsId: action.checkInId,
      };
    default:
      return state;
  }
}
