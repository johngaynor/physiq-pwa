import {
  FETCH_CHECKINS,
  LOAD_CHECKINS,
  FETCH_EDIT_CHECKIN,
  LOAD_EDIT_CHECKIN,
  FETCH_DELETE_CHECKIN,
  LOAD_DELETE_CHECKIN,
} from "../../../store/actionTypes";

// data object types
export type CheckInAttachment = {
  id?: number;
  checkInId?: number;
  s3Filename?: string;
  poseId?: number;
};

export type CheckIn = {
  id?: number;
  userId?: string;
  date: string; // varchar(10) - likely YYYY-MM-DD format
  hormones?: string;
  phase?: string;
  timeline?: string;
  cheats?: string; // mediumtext
  comments?: string; // mediumtext
  training?: string;
  avgTotalSleep?: number; // decimal(10,2)
  avgTotalBed?: number; // decimal(10,2)
  avgRecoveryIndex?: number; // decimal(10,2)
  avgRemQty?: number; // decimal(10,2)
  avgDeepQty?: number; // decimal(10,2)
  attachments?: CheckInAttachment[] | null;
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
  | { type: typeof LOAD_DELETE_CHECKIN; id: number };

export interface CheckInState {
  checkIns: CheckIn[] | null;
  checkInsLoading: boolean;
  editCheckInLoading?: boolean;
  deleteCheckInLoading?: boolean;
}
