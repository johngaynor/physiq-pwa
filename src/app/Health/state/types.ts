export type DailyLog = {
  date: string;
  weight?: number | null;
  steps?: number | null;
  totalBed?: number | null;
  totalSleep?: number | null;
  awakeQty?: number | null;
  lightQty?: number | null;
  remQty?: number | null;
  deepQty?: number | null;
};
