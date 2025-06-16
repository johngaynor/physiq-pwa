import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type StatisticsCardProps = {
  title: string;
  value: number | string;
  stat: string;
  subtitle: string;
  description: string;
  positive?: boolean; // used to determine whether or not the value is positive or negative
  success?: boolean; // used to determine whether or not the value is good or bad
};

export default function StatisticsCard({
  title,
  value,
  stat,
  subtitle,
  description,
  positive = false,
  success = false,
}: StatisticsCardProps) {
  return (
    <Card className="w-full">
      <CardContent>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-2">{title}</p>
            <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
          </div>
          <div
            className={cn(
              "flex items-center text-sm font-semibold rounded-full px-2 py-1 gap-1",
              success
                ? "text-green-500 bg-green-900/30"
                : "text-red-500 bg-red-900/30"
            )}
          >
            {positive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            {stat}
          </div>
        </div>
        <div className="mt-4 text-sm">
          <p className="text-muted-foreground flex items-center gap-1 font-medium">
            {subtitle}{" "}
            {positive ? (
              <TrendingUp className="h-4 w-4 inline-block" />
            ) : (
              <TrendingDown className="h-4 w-4 inline-block" />
            )}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
