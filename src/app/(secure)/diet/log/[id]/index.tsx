"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../../store/reducer";
import { getDietLogs } from "../../state/actions";
import { getDailyLogs } from "@/app/(secure)/health/state/actions";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { StatisticsGraph } from "@/app/(secure)/health/components/StatisticsGraph";

function mapStateToProps(state: RootState) {
  return {
    dietLogs: state.diet.dietLogs,
    dietLogsLoading: state.diet.dietLogsLoading,
    dailyLogs: state.health.dailyLogs,
    dailyLogsLoading: state.health.dailyLogsLoading,
  };
}

const connector = connect(mapStateToProps, { getDietLogs, getDailyLogs });
type PropsFromRedux = ConnectedProps<typeof connector>;

const DietLog: React.FC<PropsFromRedux> = ({
  dietLogs,
  dietLogsLoading,
  getDietLogs,
  dailyLogs,
  dailyLogsLoading,
  getDailyLogs,
}) => {
  React.useEffect(() => {
    if (!dietLogs && !dietLogsLoading) getDietLogs();
    if (!dailyLogs && !dailyLogsLoading) getDailyLogs();
  }, [
    dietLogs,
    dietLogsLoading,
    getDietLogs,
    dailyLogs,
    dailyLogsLoading,
    getDailyLogs,
  ]);

  const params = useParams();

  const logId = params.id ? parseInt(params.id as string) : null;

  const log = React.useMemo(() => {
    return dietLogs?.find((log) => log.id === logId);
  }, [dietLogs, logId]);

  const nextLog = React.useMemo(() => {
    if (!dietLogs || !log) return null;

    const sortedLogs = [...dietLogs].sort((a, b) =>
      a.effectiveDate.localeCompare(b.effectiveDate)
    );

    const index = sortedLogs.findIndex((d) => d.id === log.id);
    return sortedLogs[index + 1] ?? null;
  }, [dietLogs, log]);

  const filteredDailyLogs = React.useMemo(() => {
    if (!dailyLogs || !log) return [];

    const start = log.effectiveDate;
    const end = nextLog?.effectiveDate ?? null;

    return dailyLogs.filter((dl) => {
      const date = dl.date;
      return end ? date >= start && date < end : date >= start;
    });
  }, [dailyLogs, log, nextLog]);

  if (dietLogsLoading) {
    return <h1>loading...</h1>;
  } else if (!log) {
    return (
      <div className="w-full">
        <Card className="w-full rounded-sm p-0">
          <CardContent>
            <h1>Log not found</h1>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="w-full">
      <Card className="w-full rounded-sm p-0">
        <CardContent className="flex flex-col md:flex-row justify-between grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div>
            <StatisticsGraph
              dailyLogs={filteredDailyLogs}
              title="Weight Changes this Diet Log"
              unit="lbs"
              dataKeys={["weight"]}
              showUnit
              rounding={2}
              primaryKey="weight"
              subtitle="this calorie adjustment"
            />
          </div>
          <div>right</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default connector(DietLog);
