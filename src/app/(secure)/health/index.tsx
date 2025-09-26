"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducer";
import { getDailyLogs } from "./state/actions";
import { getCheckIns } from "../checkins/state/actions";
import StatisticsCard from "./components/StatisticsCard";
import { StatisticsGraph } from "./components/StatisticsGraph";
import { DateTime } from "luxon";
import { Button, Skeleton } from "@/components/ui";
import { useRouter } from "next/navigation";
import { getLatestDietLog } from "../diet/state/actions";

function mapStateToProps(state: RootState) {
  return {
    dailyLogs: state.health.dailyLogs,
    dailyLogsLoading: state.health.dailyLogsLoading,
    checkIns: state.checkins.checkIns,
    checkInsLoading: state.checkins.checkInsLoading,
    dietLog: state.diet.dietLog,
    dietLogLoading: state.diet.dietLogLoading,
  };
}

const connector = connect(mapStateToProps, {
  getDailyLogs,
  getCheckIns,
  getLatestDietLog,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const filterOptions: {
  label: string;
  value: "today" | "lastCheckIn" | "last30";
}[] = [
  { label: "Today", value: "today" },
  { label: "Last Check-in", value: "lastCheckIn" },
  { label: "Last 30 Days", value: "last30" },
];

const HealthDashboard: React.FC<PropsFromRedux> = ({
  dailyLogs,
  dailyLogsLoading,
  getDailyLogs,
  checkIns,
  checkInsLoading,
  getCheckIns,
  dietLog,
  dietLogLoading,
  getLatestDietLog,
}) => {
  const [filter, setFilter] = React.useState<
    "today" | "lastCheckIn" | "last30"
  >("lastCheckIn");
  const [days, setDays] = React.useState<number>(0);

  const router = useRouter();

  React.useEffect(() => {
    if (!dailyLogs && !dailyLogsLoading) getDailyLogs();
    if (!checkIns && !checkInsLoading) getCheckIns();
    if (!dietLogLoading && !dietLog) getLatestDietLog();
  }, [
    dailyLogs,
    dailyLogsLoading,
    getDailyLogs,
    checkIns,
    checkInsLoading,
    getCheckIns,
    dietLog,
    dietLogLoading,
    getLatestDietLog,
  ]);

  const sortedLogs = React.useMemo(() => {
    return (
      dailyLogs?.slice().sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }) || []
    );
  }, [dailyLogs]);

  const lastCheckIn = React.useMemo(() => {
    if (!checkIns || !checkIns.length) return null;
    return (
      checkIns?.slice().sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      })[0] || null
    );
  }, [checkIns]);

  // update days based on filter
  React.useEffect(() => {
    switch (filter) {
      case "today":
        setDays(1);
        break;
      case "lastCheckIn":
        if (lastCheckIn) {
          const diff = DateTime.fromISO(lastCheckIn.date).diffNow("days").days;
          setDays(diff <= 1 ? Math.floor(Math.abs(diff)) : 0);
        } else {
          setDays(0);
        }
        break;
      case "last30":
        setDays(30);
        break;
      default:
        setDays(0);
    }
  }, [filter, lastCheckIn]);

  const filteredLogs = React.useMemo(() => {
    const startDate = DateTime.now().minus({ days: days + 1 });
    const endDate = DateTime.now();

    return sortedLogs?.filter((log) => {
      const logDate = DateTime.fromISO(log.date);
      return logDate >= startDate && logDate <= endDate;
    });
  }, [sortedLogs, days]);

  const statistics = (() => {
    const reduced = filteredLogs?.reduce(
      (acc, val) => {
        const { weight, totalSleep, bodyfat, steps } = val;

        if (weight) {
          acc.weight.count += 1;
          acc.weight.val += weight;
          acc.weight.latest = weight;
          acc.weight.values.push(weight);
        }
        if (totalSleep) {
          acc.totalSleep.count += 1;
          acc.totalSleep.val += totalSleep;
          acc.totalSleep.latest = totalSleep;
          acc.totalSleep.values.push(totalSleep);
        }
        if (bodyfat) {
          acc.bodyfat.count += 1;
          acc.bodyfat.val += bodyfat;
          acc.bodyfat.latest = bodyfat;
          acc.bodyfat.values.push(bodyfat);
        }
        if (steps) {
          acc.steps.count += 1;
          acc.steps.val += steps;
          acc.steps.latest = steps;
          acc.steps.values.push(steps);
        }

        return acc;
      },
      {
        weight: {
          count: 0,
          val: 0,
          avg: 0,
          latest: 0,
          diff: 0,
          values: [] as number[],
        },
        totalSleep: {
          count: 0,
          val: 0,
          avg: 0,
          latest: 0,
          diff: 0,
          values: [] as number[],
        },
        bodyfat: {
          count: 0,
          val: 0,
          avg: 0,
          latest: 0,
          diff: 0,
          values: [] as number[],
        },
        steps: {
          count: 0,
          val: 0,
          avg: 0,
          latest: 0,
          diff: 0,
          values: [] as number[],
        },
      }
    );

    if (!reduced) return null;

    Object.entries(reduced).forEach(([, stat]) => {
      stat.avg = stat.count ? stat.val / stat.count : 0;
      stat.diff = stat.latest - stat.avg;
    });

    return reduced;
  })();

  const statsLabel =
    filter === "today"
      ? "today"
      : filter === "lastCheckIn" || filter === "last30"
      ? `over the last ${days} day${days !== 1 ? "s" : ""}`
      : "";

  function getStatInterpretation(type: string, diff: number, avg: number) {
    switch (type) {
      case "weight":
        if (dietLog && dietLog.phase === "Bulk") {
          if (diff >= 0) {
            return "positive";
          } else return "negative";
        } else if (dietLog && dietLog.phase === "Cut") {
          if (diff <= 0) {
            return "positive";
          } else return "negative";
        } else return "neutral"; // case for no diet log or phase === "Maintenance"
      case "bodyfat":
        if (dietLog && dietLog.phase === "Bulk") {
          if (diff > 0) {
            return "neutral";
          } else return "positive";
        } else if (dietLog && dietLog.phase === "Cut") {
          if (diff < 0) {
            return "positive";
          } else if (diff > 0) {
            return "negative";
          } else return "neutral";
        } else return "neutral"; // case for no diet log or phase === "Maintenance"
      case "steps":
        if (dietLog && dietLog.phase === "Bulk" && dietLog.steps) {
          // if average is below target, increasing is positive, otherwise increasing is negative
          if (avg < dietLog.steps) {
            if (diff < 0) {
              return "positive";
            } else return "negative";
          } else {
            if (diff > 0) {
              return "positive";
            } else return "negative";
          }
        } else if (dietLog && dietLog.phase === "Cut" && dietLog.steps) {
          // if average is at/above target, anything is positive, otherwise increasing is positive, decreasing is negative
          if (avg >= dietLog.steps) {
            return "positive";
          } else {
            if (diff > 0) {
              return "positive";
            } else return "negative";
          }
        } else {
          if (diff > 0) {
            return "positive";
          } else if (diff < 0) {
            return "negative";
          } else return "neutral";
        }
      case "sleep":
        if (diff > 0) {
          return "positive";
        } else if (diff < 0) {
          return "negative";
        } else return "neutral";
      default:
        return "neutral";
    }
  }

  if (dailyLogsLoading || checkInsLoading || dietLogLoading) {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-4">
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
            type="weight"
            value={statistics?.weight.avg || 0}
            stat={statistics?.weight.diff || 0}
            interpretation={getStatInterpretation(
              "weight",
              statistics?.weight.diff || 0,
              statistics?.weight.avg || 0
            )}
            description={`Weight ${statsLabel}`}
            values={statistics?.weight.values || []}
            onClick={() => router.push("/health/logs/weight")}
          />
          <StatisticsCard
            title="Bodyfat %"
            type="bodyfat"
            value={statistics?.bodyfat.avg || 0}
            stat={statistics?.bodyfat.diff || 0}
            interpretation={getStatInterpretation(
              "bodyfat",
              statistics?.bodyfat.diff || 0,
              statistics?.bodyfat.avg || 0
            )}
            description={`Bodyfat % ${statsLabel}`}
            values={statistics?.bodyfat.values || []}
            onClick={() => router.push("/health/logs/bodyfat")}
          />
          <StatisticsCard
            title="Steps"
            type="steps"
            value={statistics?.steps.avg || 0}
            stat={statistics?.steps.diff || 0}
            interpretation={getStatInterpretation(
              "steps",
              statistics?.steps.diff || 0,
              statistics?.steps.avg || 0
            )}
            description={`Steps ${statsLabel}`}
            values={statistics?.steps.values || []}
            onClick={() => router.push("/health/logs/steps")}
          />
          <StatisticsCard
            title="Sleep"
            type="sleep"
            value={statistics?.totalSleep.avg || 0}
            stat={statistics?.totalSleep.diff || 0}
            interpretation={getStatInterpretation(
              "sleep",
              statistics?.totalSleep.diff || 0,
              statistics?.totalSleep.avg || 0
            )}
            description={`Sleep ${statsLabel}`}
            values={statistics?.totalSleep.values || []}
            onClick={() => router.push("/health/logs/sleep")}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full pt-4">
          <StatisticsGraph
            title="Weight"
            dailyLogs={filteredLogs}
            dataKeys={["weight", "ffm"]}
            primaryKey="weight"
            unit="lbs"
            showUnit
            rounding={2}
            onClick={() => router.push("/health/logs/weight")}
          />
          <StatisticsGraph
            title="Bodyfat"
            dailyLogs={filteredLogs}
            dataKeys={["bodyfat"]}
            primaryKey="bodyfat"
            unit="%"
            showUnit
            rounding={2}
            onClick={() => router.push("/health/logs/bodyfat")}
          />
          <StatisticsGraph
            title="Sleep"
            dailyLogs={filteredLogs}
            dataKeys={["totalSleep", "totalBed"]}
            primaryKey="totalSleep"
            unit="hrs"
            rounding={2}
            singleAxis
            onClick={() => router.push("/health/logs/sleep")}
          />
          <StatisticsGraph
            title="Steps"
            dailyLogs={filteredLogs}
            dataKeys={["steps", "stepsTarget"]}
            primaryKey="steps"
            unit="steps"
            rounding={1000}
            singleAxis
            onClick={() => router.push("/health/logs/steps")}
          />
          <StatisticsGraph
            title="Water Intake"
            dailyLogs={filteredLogs}
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
            dailyLogs={filteredLogs}
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
