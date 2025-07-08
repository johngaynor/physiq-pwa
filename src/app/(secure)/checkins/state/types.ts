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
} from "../../../store/actionTypes";

// data object types
export type Pose = {
  id: number;
  name: string;
};

export type CheckInAttachment = {
  id?: number;
  checkInId?: number;
  s3Filename?: string;
  poseId?: number;
  url?: string;
  filename?: string;
  blob?: {
    contentType: string;
    data: string; // base64 encoded image data
    lastModified: string;
    size: number;
  };
};

export type CheckIn = {
  id?: number;
  date: string; // varchar(10) - likely YYYY-MM-DD format
  cheats?: string; // mediumtext
  comments?: string; // mediumtext
  training?: string;
  // Note: attachments are now fetched separately
};

// action types
export type Action =
  | { type: typeof FETCH_CHECKINS }
  | { type: typeof LOAD_CHECKINS; data: CheckIn[] }
  | { type: typeof FETCH_EDIT_CHECKIN }
  | {
      type: typeof LOAD_EDIT_CHECKIN;
      data: { existing: boolean; checkIn: CheckIn };
    }
  | { type: typeof FETCH_DELETE_CHECKIN }
  | { type: typeof LOAD_DELETE_CHECKIN; id: number }
  | { type: typeof FETCH_CHECKIN_ATTACHMENTS; checkInId: number }
  | {
      type: typeof LOAD_CHECKIN_ATTACHMENTS;
      checkInId: number;
      attachments: CheckInAttachment[];
    }
  | { type: typeof FETCH_POSES }
  | { type: typeof LOAD_POSES; data: Pose[] }
  | {
      type: typeof FETCH_ASSIGN_CHECKIN_POSE;
      attachmentId: number;
      poseId: number;
    }
  | {
      type: typeof LOAD_ASSIGN_CHECKIN_POSE;
      attachmentId: number;
      poseId: number;
      attachment: CheckInAttachment;
    };

export interface CheckInState {
  checkIns: CheckIn[] | null;
  checkInsLoading: boolean;
  editCheckInLoading?: boolean;
  deleteCheckInLoading?: boolean;
  attachments: CheckInAttachment[];
  attachmentsLoading: boolean;
  attachmentsId: number | null;
  poses: Pose[] | null;
  posesLoading: boolean;
  assignPoseLoading: boolean;
}
