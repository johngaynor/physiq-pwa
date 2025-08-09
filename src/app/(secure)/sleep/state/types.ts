import { FETCH_SLEEP_LOGS, LOAD_SLEEP_LOGS } from "@/app/store/actionTypes";

export interface SleepLog {
  id: number;
  userId: number;
  date: string;
  totalSleep: number;
  recoveryIndex: number;
  readinessScore: number;
  awakeQty: number;
  remQty: number;
  lightQty: number;
  deepQty: number;
  totalBed: number;
  bedtimeStart: string;
  bedtimeEnd: string;
  efficiency: number;
  sleepScore: number;
  timingScore: number;
  restfulnessScore: number;
  latency: number;
  tags: SleepLogTag[];
}

export interface SleepLogTag {
  id: number;
  logId: number;
  tagId: number;
  tagTypeCode: string;
  startTime: string;
  endTime: string;
  comment: string;
  qty: number;
  customName: string;
}

export type Action =
  | { type: typeof FETCH_SLEEP_LOGS }
  | { type: typeof LOAD_SLEEP_LOGS; data: SleepLog[] };
