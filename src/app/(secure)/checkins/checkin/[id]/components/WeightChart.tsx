"use client";

import React from "react";
import { LineChart, CartesianGrid, XAxis, Line, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { DateTime } from "luxon";
import { DailyLog } from "@/app/(secure)/health/state/types";

interface WeightChartProps {
  dailyLogs: DailyLog[];
  height?: number;
}

const chartConfig = {
  weight: {
    label: "Weight",
  },
} satisfies ChartConfig;

export const WeightChart: React.FC<WeightChartProps> = ({
  dailyLogs,
  height = 120,
}) => {
  const weightData = React.useMemo(() => {
    // Get last 30 days of data with weight entries
    const sortedLogs =
      dailyLogs
        ?.slice()
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .filter((log) => log.weight !== null && log.weight !== undefined)
        .slice(-30) || [];

    return sortedLogs.map((log) => ({
      ...log,
      formattedDate: DateTime.fromISO(log.date).toFormat("MMM d"),
    }));
  }, [dailyLogs]);

  const getRoundedDomain = React.useCallback(() => {
    const weights = weightData.map((d) => d.weight!);
    if (weights.length === 0) return [0, 200];

    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const padding = (max - min) * 0.1; // 10% padding

    return [
      Math.floor((min - padding) / 5) * 5, // Round down to nearest 5
      Math.ceil((max + padding) / 5) * 5, // Round up to nearest 5
    ];
  }, [weightData]);

  if (weightData.length === 0) {
    return (
      <div
        style={{
          height: `${height}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          color: "#6b7280",
          border: "1px solid #e5e7eb",
          borderRadius: "6px",
          backgroundColor: "#f9fafb",
        }}
      >
        No weight data available for the last 30 days
      </div>
    );
  }

  return (
    <div style={{ height: `${height}px`, width: "80%" }}>
      <ChartContainer config={chartConfig}>
        <LineChart
          data={weightData}
          margin={{
            left: 20,
            right: 10,
            top: 15,
            bottom: 20,
          }}
        >
          <CartesianGrid vertical={false} stroke="#e5e7eb" />
          <XAxis
            dataKey="formattedDate"
            tickLine={false}
            axisLine={true}
            tickMargin={8}
            interval="preserveStartEnd"
            fontSize={10}
            stroke="#6b7280"
          />
          <YAxis
            domain={getRoundedDomain()}
            tickLine={false}
            axisLine={true}
            tickMargin={8}
            fontSize={10}
            stroke="#6b7280"
            tickFormatter={(value) => `${value}`}
          />
          <ChartTooltip
            cursor={{ stroke: "#d1d5db", strokeWidth: 1 }}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0];
                return (
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                      padding: "8px 12px",
                      fontSize: "12px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                      {label}
                    </div>
                    <div style={{ color: "#6b7280" }}>
                      Weight:{" "}
                      {typeof data.value === "number"
                        ? data.value.toFixed(1)
                        : data.value}{" "}
                      lbs
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            dataKey="weight"
            type="monotone"
            stroke="#d97706" // Orange color to match the weight section theme
            strokeWidth={2.5}
            dot={{
              fill: "#d97706",
              strokeWidth: 0,
              r: 3,
            }}
            activeDot={{
              r: 5,
              stroke: "#d97706",
              strokeWidth: 2,
              fill: "#ffffff",
            }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default WeightChart;
