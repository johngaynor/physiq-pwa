"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, CartesianGrid, XAxis, Line, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  //   ChartLegend,
  //   ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartProps } from "../logs/components/Graphs/types";
import { DateTime } from "luxon";

const chartConfig = {} satisfies ChartConfig;

export function StatisticsGraph({
  dailyLogs = [],
  title,
  unit,
  dataKey,
  rounding,
  showUnit,
}: ChartProps) {
  const startingValue = dailyLogs ? dailyLogs.find((d) => d[dataKey]) : null;
  const endingValue = dailyLogs
    ? [...dailyLogs].reverse().find((d) => d[dataKey])
    : null;

  const diff =
    startingValue?.[dataKey] && endingValue?.[dataKey]
      ? parseFloat(
          (
            (endingValue[dataKey] as number) -
            (startingValue[dataKey] as number)
          ).toFixed(2)
        )
      : 0;

  function getRoundedDomain(rounding: number) {
    return ([dataMin, dataMax]: [number, number]) =>
      [
        Math.floor(dataMin / rounding) * rounding,
        Math.ceil(dataMax / rounding) * rounding,
      ] as [number, number];
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {title} {showUnit ? `(${unit})` : ""}
        </CardTitle>
        <CardDescription>Showing {dataKey} for the last month</CardDescription>
      </CardHeader>
      <CardContent className="ms:p-2">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[200px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={dailyLogs || []}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = DateTime.fromISO(value);
                return date.toFormat("MMM d");
              }}
            />
            <YAxis
              domain={getRoundedDomain(rounding)}
              tickLine={true}
              axisLine={true}
              tickMargin={8}
            />

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey={dataKey}
              type="monotone"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={false}
            />
            {/* <ChartLegend content={<ChartLegendContent />} /> */}
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              You are {diff >= 0 ? "up" : "down"} {Math.abs(diff)} {unit} over
              the last month
              {diff >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              {DateTime.fromISO(
                startingValue ? startingValue.date : ""
              ).toFormat("LLL dd")}{" "}
              -{" "}
              {DateTime.fromISO(endingValue ? endingValue.date : "").toFormat(
                "LLL dd"
              )}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
