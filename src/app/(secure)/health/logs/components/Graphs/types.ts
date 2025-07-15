import { DailyLog } from "../../../state/types";

type DataKeys = {
  weight?: string;
  steps?: string;
  water?: string;
  bodyfat?: string;
  calories?: string;
  totalSleep?: string;
  totalBed?: string;
  ffm?: string;
  caloriesTarget?: string;
  waterTarget?: string;
  stepsTarget?: string;
};

export type ChartProps = {
  dailyLogs: DailyLog[] | null;
  title: string;
  unit: string;
  dataKey: keyof DataKeys;
  rounding: number;
  showUnit?: boolean;
};

export type HealthChartProps = {
  dailyLogs: DailyLog[] | null;
  title: string;
  unit: string;
  dataKeys: (keyof DataKeys)[];
  primaryKey: keyof DataKeys;
  rounding: number;
  showUnit?: boolean;
  singleAxis?: boolean;
  subtitle?: string;
  onClick?: () => void;
};
