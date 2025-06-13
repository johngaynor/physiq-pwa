"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DailyLog } from "../../state/types";

export const description = "An interactive line chart";

const chartConfig = {
  views: {
    label: "Weight",
  },
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

type ChartProps = {
  dailyLogs: DailyLog[] | null;
};

export function ChartLineMultiple({ dailyLogs = [] }: ChartProps) {
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
    function average(weights: (number | undefined | null)[]) {
      const validWeights = weights.filter(
        (w): w is number => typeof w === "number"
      );
      const sum = validWeights.reduce((acc, w) => acc + w, 0);
      return validWeights.length
        ? Math.round((sum / validWeights.length) * 10) / 10
        : 0;
    }

    const last7Weights = sortedLogs?.slice(-7).map((d) => d.weight) ?? [];
    const last30Weights = sortedLogs?.slice(-30).map((d) => d.weight) ?? [];

    return {
      today: sortedLogs[sortedLogs.length - 1]?.weight ?? "--",
      last7: average(last7Weights),
      last30: average(last30Weights),
    };
  }, [sortedLogs]);

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex sm:hidden lg:flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Morning Weight (lbs)</CardTitle>
          <CardDescription>
            Showing weight over the last 30 days
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
                  {averages[key as keyof typeof averages].toLocaleString()} lbs
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[225px] w-full"
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
              domain={[
                (dataMin: number) => dataMin - 2,
                (dataMax: number) => dataMax + 2,
              ]}
              tickLine={true}
              axisLine={true}
              tickMargin={8}
            />

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="weight"
              type="linear"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
