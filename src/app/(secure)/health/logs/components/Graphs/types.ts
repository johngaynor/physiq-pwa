import { DailyLog } from "../../../state/types";

type DataKeys = {
  weight?: string;
  steps?: string;
  water?: string;
  bodyfat?: string;
  calories?: string;
};

export type ChartProps = {
  dailyLogs: DailyLog[] | null;
  title: string;
  unit: string;
  dataKey: keyof DataKeys;
  rounding: number;
  showUnit?: boolean;
};
