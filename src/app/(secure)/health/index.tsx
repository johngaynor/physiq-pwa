"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducer";
import { getDailyLogs } from "./state/actions";
import StatisticsCard from "./components/StatisticsCard";
import { StatisticsGraph } from "./components/StatisticsGraph";
import { DateTime } from "luxon";
import { convertTime } from "@/app/components/Time";
import { Button, Skeleton } from "@/components/ui";
import { useRouter } from "next/navigation";

function mapStateToProps(state: RootState) {
  return {
    dailyLogs: state.health.dailyLogs,
    dailyLogsLoading: state.health.dailyLogsLoading,
  };
}

const connector = connect(mapStateToProps, { getDailyLogs });
type PropsFromRedux = ConnectedProps<typeof connector>;

const filterOptions: {
  label: string;
  value: "today" | "lastCheckin" | "last30" | "custom";
}[] = [
  { label: "Today", value: "today" },
  { label: "Last Check-in", value: "lastCheckin" },
  { label: "Last 30 Days", value: "last30" },
  { label: "Custom Range", value: "custom" },
];

const HealthDashboard: React.FC<PropsFromRedux> = ({
  dailyLogs,
  dailyLogsLoading,
  getDailyLogs,
}) => {
  const [filter, setFilter] = React.useState<
    "today" | "lastCheckin" | "last30" | "custom"
  >("lastCheckin");
  React.useEffect(() => {
    if (!dailyLogs && !dailyLogsLoading) getDailyLogs();
  }, [dailyLogs, dailyLogsLoading, getDailyLogs]);

  const sortedLogs = React.useMemo(() => {
    return (
      dailyLogs?.slice().sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }) || []
    );
  }, [dailyLogs]);

  const last30Days = React.useMemo(() => {
    return sortedLogs?.slice(-30) || [];
  }, [sortedLogs]);

  const averages = React.useMemo(() => {
    if (!last30Days.length) return {};

    const totals = last30Days.reduce(
      (acc, log) => {
        const { weight, totalSleep, bodyfat } = log;

        if (weight) {
          acc.weight.count += 1;
          acc.weight.val += weight;
        }
        if (totalSleep) {
          acc.totalSleep.count += 1;
          acc.totalSleep.val += totalSleep;
        }
        if (bodyfat) {
          acc.bodyfat.count += 1;
          acc.bodyfat.val += bodyfat;
        }
        if (weight && bodyfat) {
          const ffm = weight * (1 - bodyfat / 100);
          acc.ffm.count += 1;
          acc.ffm.val += ffm;
        }
        return acc;
      },
      {
        weight: { count: 0, val: 0 },
        totalSleep: { count: 0, val: 0 },
        bodyfat: { count: 0, val: 0 },
        ffm: { count: 0, val: 0 },
      }
    );

    return {
      weight: parseFloat((totals.weight.val / totals.weight.count).toFixed(1)),
      totalSleep: parseFloat(
        (totals.totalSleep.val / totals.totalSleep.count).toFixed(1)
      ),
      bodyfat: parseFloat(
        (totals.bodyfat.val / totals.bodyfat.count).toFixed(1)
      ),
      ffm: parseFloat((totals.ffm.val / totals.ffm.count).toFixed(1)),
    };
  }, [last30Days]);

  const today = last30Days?.find((l) => l.date === DateTime.now().toISODate());

  const diffs = today
    ? {
        weight:
          today.weight && averages.weight
            ? parseFloat((today.weight - averages.weight).toFixed(1))
            : null,
        totalSleep:
          today.totalSleep && averages.totalSleep
            ? parseFloat((today.totalSleep - averages.totalSleep).toFixed(1))
            : null,
        bodyfat:
          today.bodyfat && averages.bodyfat
            ? parseFloat((today.bodyfat - averages.bodyfat).toFixed(1))
            : null,
        ffm:
          today.weight && today.bodyfat && averages.ffm
            ? parseFloat(
                (
                  today.weight * (1 - today.bodyfat / 100) -
                  averages.ffm
                ).toFixed(1)
              )
            : null,
      }
    : {};

  const router = useRouter();

  if (dailyLogsLoading) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-[170px] w-full rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 w-full">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-[300px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  } else
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {filterOptions.map((option) => (
            <Button
              key={"button-" + option.value}
              onClick={() => setFilter(option.value)}
              type="button"
              variant={option.value === filter ? "default" : "outline"}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <StatisticsCard
            title="Weight"
            value={today?.weight ? today.weight.toFixed(1) + " lbs" : "--"}
            stat={
              diffs.weight
                ? `${diffs.weight >= 0 ? "+" : "-"}${Math.abs(
                    diffs.weight
                  )} lbs`
                : "--"
            }
            subtitle={
              diffs.weight
                ? `Trending ${diffs.weight >= 0 ? "up" : "down"} this month`
                : "--"
            }
            positive={diffs.weight ? diffs.weight >= 0 : false}
            success={diffs.weight ? diffs.weight >= 0 : false}
            description="Weight today"
            onClick={() => router.push("/health/logs/weight")}
          />
          <StatisticsCard
            title="Fat Free Mass"
            value={
              today?.weight && today.bodyfat
                ? parseFloat(
                    (today.weight * (1 - today.bodyfat / 100)).toFixed(1)
                  ).toFixed(1) + " lbs"
                : "--"
            }
            stat={
              diffs.ffm
                ? `${diffs.ffm >= 0 ? "+" : "-"}${Math.abs(diffs.ffm)} lbs`
                : "--"
            }
            subtitle={
              diffs.ffm
                ? `Trending ${diffs.ffm >= 0 ? "up" : "down"} this month`
                : "--"
            }
            positive={diffs.ffm ? diffs.ffm >= 0 : false}
            success={diffs.ffm ? diffs.ffm >= 0 : false}
            description="FFM today"
            onClick={() => router.push("/health/logs/bodyfat")}
          />
          <StatisticsCard
            title="Body Fat %"
            value={today?.bodyfat ? today.bodyfat.toFixed(1) + "%" : "--"}
            stat={
              diffs.bodyfat
                ? `${diffs.bodyfat >= 0 ? "+" : "-"}${Math.abs(diffs.bodyfat)}%`
                : "--"
            }
            subtitle={
              diffs.bodyfat
                ? `Trending ${diffs.bodyfat >= 0 ? "up" : "down"} this month`
                : "--"
            }
            positive={diffs.bodyfat ? diffs.bodyfat >= 0 : false}
            success={diffs.bodyfat ? diffs.bodyfat <= 0 : false}
            description="BF % today"
            onClick={() => router.push("/health/logs/bodyfat")}
          />
          <StatisticsCard
            title="Sleep"
            value={today?.totalSleep ? convertTime(today.totalSleep) : "--"}
            stat={
              diffs.totalSleep
                ? `${diffs.totalSleep >= 0 ? "+" : "-"}${convertTime(
                    Math.abs(diffs.totalSleep)
                  )}`
                : "--"
            }
            subtitle={
              diffs.totalSleep
                ? `Trending ${diffs.totalSleep >= 0 ? "up" : "down"} this month`
                : "--"
            }
            positive={diffs.totalSleep ? diffs.totalSleep >= 0 : false}
            success={diffs.totalSleep ? diffs.totalSleep >= 0 : false}
            description="Sleep today"
            onClick={() => router.push("/health/logs/sleep")}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full pt-4">
          <StatisticsGraph
            title="Weight"
            dailyLogs={last30Days}
            dataKeys={["weight", "ffm"]}
            primaryKey="weight"
            unit="lbs"
            showUnit
            rounding={2}
            onClick={() => router.push("/health/logs/weight")}
          />
          <StatisticsGraph
            title="Bodyfat"
            dailyLogs={last30Days}
            dataKeys={["bodyfat"]}
            primaryKey="bodyfat"
            unit="%"
            showUnit
            rounding={2}
            onClick={() => router.push("/health/logs/bodyfat")}
          />
          {/* will want to figure out formatting for sleep */}
          <StatisticsGraph
            title="Sleep"
            dailyLogs={last30Days}
            dataKeys={["totalSleep", "totalBed"]}
            primaryKey="totalSleep"
            unit="hrs"
            rounding={2}
            singleAxis
            onClick={() => router.push("/health/logs/sleep")}
          />
          <StatisticsGraph
            title="Steps"
            dailyLogs={last30Days}
            dataKeys={["steps", "stepsTarget"]}
            primaryKey="steps"
            unit="steps"
            rounding={1000}
            singleAxis
            onClick={() => router.push("/health/logs/steps")}
          />
          <StatisticsGraph
            title="Water Intake"
            dailyLogs={last30Days}
            dataKeys={["water", "waterTarget"]}
            primaryKey="water"
            unit="oz"
            showUnit
            rounding={10}
            singleAxis
            onClick={() => router.push("/health/logs/water")}
          />
          <StatisticsGraph
            title="Caloric Intake"
            dailyLogs={last30Days}
            dataKeys={["calories", "caloriesTarget"]}
            primaryKey="calories"
            unit="cal"
            showUnit
            rounding={10}
            singleAxis
            onClick={() => router.push("/health/logs/calories")}
          />
        </div>
      </div>
    );
};

export default connector(HealthDashboard);
