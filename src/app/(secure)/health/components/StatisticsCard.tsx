import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { TrendingDown, TrendingUp, MoveHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { convertTime } from "@/app/components/Time";

type StatisticsCardProps = {
  title: string;
  type: "weight" | "bodyfat" | "steps" | "sleep"; // used to determine interpretation logic
  value: number;
  stat: number;
  interpretation?: "positive" | "negative" | "neutral"; // used to determine whether or not the value is perceived as good or bad
  onClick?: () => void;
  values?: number[]; // array of values used in calculation
  days: number;
};

function formatStatistic(type: string, stat: number) {
  switch (type) {
    case "weight":
      if (!stat) return "0.0 lbs";
      return `${Math.abs(stat).toFixed(1)} lbs`;
    case "bodyfat":
      if (!stat) return "0.0%";
      return `${Math.abs(stat).toFixed(1)}%`;
    case "steps":
      if (!stat) return "0";
      return `${Math.abs(stat).toFixed(0)}`;
    case "sleep":
      if (!stat) return "0h 0m";
      return convertTime(Math.abs(stat));
  }
}

function formatValue(type: string, value: number) {
  switch (type) {
    case "weight":
      if (!value) return "--";
      return `${value.toFixed(1)} lbs`;
    case "bodyfat":
      if (!value) return "--";
      return `${value.toFixed(1)}%`;
    case "steps":
      if (!value) return "--";
      return `${value.toFixed(0)}`;
    case "sleep":
      if (!value) return "--";
      return convertTime(value);
  }
}

function formatSubtitle(value: number) {
  let str = "on the latest entry";
  if (value > 0) {
    return `Trending up ${str}`;
  } else if (value < 0) {
    return `Trending down ${str}`;
  } else {
    return `No change ${str}`;
  }
}

function formatDescription(title: string, days: number) {
  return days === 1
    ? `${title} today`
    : `${title} over the last ${days} day${days !== 1 ? "s" : ""}`;
}

export default function StatisticsCard({
  title,
  type,
  value,
  stat,
  interpretation = "neutral",
  onClick,
  values = [],
  days,
}: StatisticsCardProps) {
  const tooltipContent = (
    <Card className="p-2">
      <CardContent className="p-3">
        <p className="font-semibold mb-2">
          {values.length
            ? "Values used in calculation:"
            : "No values available"}
        </p>
        <div className="grid grid-cols-3 gap-1 text-xs">
          {values.slice(0, 9).map((val, index) => (
            <span key={index} className="px-1 py-0.5 rounded">
              {type === "sleep"
                ? convertTime(val)
                : type === "steps"
                ? val
                : ` ${val.toFixed(1)}`}
            </span>
          ))}
          {values.length > 9 && (
            <span className="px-1 py-0.5 rounded text-muted-foreground flex items-center justify-center">
              +{values.length - 9} more...
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const cardContent = (
    <Card
      className={`w-full ${onClick ? "cursor-pointer" : "cursor-default"}`}
      onClick={onClick}
    >
      <CardContent>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-2">{title}</p>
            <h2 className="text-3xl font-bold tracking-tight">
              {formatValue(type, value)}
            </h2>
          </div>
          <div
            className={cn(
              "flex items-center text-sm font-semibold rounded-full px-2 py-1 gap-1",
              interpretation === "positive"
                ? "text-green-500 bg-green-900/30"
                : interpretation === "negative"
                ? "text-red-500 bg-red-900/30"
                : "bg-slate-600/30 text-slate-500"
            )}
          >
            {stat > 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : stat < 0 ? (
              <TrendingDown className="h-4 w-4" />
            ) : (
              <MoveHorizontal className="h-4 w-4" />
            )}
            {formatStatistic(type, stat)}
          </div>
        </div>
        <div className="mt-4 text-sm">
          <p className="text-muted-foreground flex items-center gap-1 font-medium">
            {values.length === 0
              ? "Insufficient data"
              : values.length === 1
              ? "Only 1 entry"
              : formatSubtitle(stat)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDescription(title, days)}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  if (tooltipContent) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{cardContent}</TooltipTrigger>
        <TooltipContent className="p-0 border-1 rounded-xl">
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    );
  }

  return cardContent;
}
