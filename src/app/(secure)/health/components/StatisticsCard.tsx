import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { convertTime } from "@/app/components/Time";

type StatisticsCardProps = {
  title: string;
  value: number | string;
  stat: string;
  subtitle: string;
  description: string;
  positive?: boolean; // used to determine whether or not the value is positive or negative
  success?: boolean; // used to determine whether or not the value is good or bad
  onClick?: () => void;
  values?: number[]; // array of values used in calculation
  unit?: string; // unit for displaying values
};

export default function StatisticsCard({
  title,
  value,
  stat,
  subtitle,
  description,
  positive,
  // success = false,
  onClick,
  values = [],
  unit = "",
}: StatisticsCardProps) {
  const tooltipContent =
    values.length > 0 ? (
      <Card className="p-2">
        <CardContent className="p-3">
          <p className="font-semibold mb-2">Values used in calculation:</p>
          <div className="grid grid-cols-3 gap-1 text-xs">
            {values.slice(0, 9).map((val, index) => (
              <span key={index} className="px-1 py-0.5 rounded">
                {
                  unit === "hrs"
                    ? convertTime(val)
                    : unit === ""
                    ? val.toFixed(0) // Steps - no decimals
                    : `${val.toFixed(1)}${unit}` // Weight, bodyfat - with decimals
                }
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
    ) : null;

  const cardContent = (
    <Card
      className={`w-full ${onClick ? "cursor-pointer" : "cursor-default"}`}
      onClick={onClick}
    >
      <CardContent>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-2">{title}</p>
            <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
          </div>
          <div
            className={cn(
              "flex items-center text-sm font-semibold rounded-full px-2 py-1 gap-1 text-green-500 bg-green-900/30"
              // success
              //   ? "text-green-500 bg-green-900/30"
              //   : "text-red-500 bg-red-900/30"
            )}
          >
            {positive ? (
              <TrendingUp className="h-4 w-4" />
            ) : positive === undefined ? null : (
              <TrendingDown className="h-4 w-4" />
            )}
            {stat}
          </div>
        </div>
        <div className="mt-4 text-sm">
          <p className="text-muted-foreground flex items-center gap-1 font-medium">
            {subtitle}{" "}
            {/* {positive ? (
              <TrendingUp className="h-4 w-4 inline-block" />
            ) : (
              <TrendingDown className="h-4 w-4 inline-block" />
            )} */}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
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
