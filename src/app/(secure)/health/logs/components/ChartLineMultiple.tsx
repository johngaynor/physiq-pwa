"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TrendingUp, TrendingDown } from "lucide-react";
import { DateTime } from "luxon";
import { ChartProps } from "./Graphs/types";

const chartConfig = {
  today: {
    label: "Today",
  },
  last7: {
    label: "7 Day Avg",
  },
  last30: {
    label: "30 Day Avg",
  },
} satisfies ChartConfig;

const labels = {
  today: "all time",
  last7: "7 days",
  last30: "30 days",
};

export function ChartLineMultiple({
  dailyLogs = [],
  title,
  unit,
  dataKey,
  rounding,
  showUnit = false,
}: ChartProps) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("last30");

  const sortedLogs =
    dailyLogs?.slice().sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }) || [];

  const filteredData = React.useMemo(() => {
    if (!dailyLogs) return [];

    switch (activeChart) {
      case "last30":
        return sortedLogs.slice(-30);
      case "last7":
        return sortedLogs.slice(-7);
      default:
        return sortedLogs;
    }
  }, [activeChart, sortedLogs]);

  const averages = React.useMemo(() => {
    function average(vals: (number | undefined | null)[]) {
      const validData = vals.filter((v): v is number => typeof v === "number");
      const sum = validData.reduce((acc, v) => acc + v, 0);
      return validData.length
        ? Math.round((sum / validData.length) * 10) / 10
        : 0;
    }

    const last7Data =
      sortedLogs
        ?.slice(-7)
        .map((d) => d[dataKey] as number | undefined | null) ?? [];

    const last30Data =
      sortedLogs
        ?.slice(-30)
        .map((d) => d[dataKey] as number | undefined | null) ?? [];

    return {
      today: sortedLogs[sortedLogs.length - 1]?.[dataKey] ?? "--",
      last7: average(last7Data),
      last30: average(last30Data),
    };
  }, [sortedLogs, dataKey]);

  const startingValue = filteredData.find((d) => d[dataKey]);
  const endingValue = [...filteredData].reverse().find((d) => d[dataKey]);

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
    return ([dataMin, dataMax]: [number, number], allowDataOverflow: boolean) =>
      [
        Math.floor(dataMin / rounding) * rounding,
        Math.ceil(dataMax / rounding) * rounding,
      ] as [number, number];
  }

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex sm:hidden lg:flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>
            {title} {showUnit ? `(${unit})` : ""}
          </CardTitle>
          <CardDescription>
            Showing {dataKey} {activeChart !== "today" ? "over the last" : ""}{" "}
            {labels[activeChart]}
          </CardDescription>
        </div>
        <div className="flex lg:w-auto w-full">
          {["today", "last7", "last30"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-5 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-1.5 sm:py-6 lg:px-4"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl w-auto md:w-36">
                  {averages[key as keyof typeof averages].toLocaleString()}{" "}
                  {showUnit ? unit : ""}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="ms:p-2">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[200px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={filteredData}
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
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
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
              type="linear"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm -mt-4 py-5">
          <div className="flex flex-col lg:flex-row items-start gap-2 w-full">
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending {diff >= 0 ? "up" : "down"} by {Math.abs(diff)} {unit}{" "}
              {activeChart !== "today" ? "over the last" : ""}{" "}
              {labels[activeChart]}
              {diff >= 0 ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              {DateTime.fromISO(filteredData[0]?.date).toFormat("LLL dd yyyy")}{" "}
              -{" "}
              {DateTime.fromISO(
                filteredData[filteredData.length - 1]?.date
              ).toFormat("LLL dd yyyy")}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
