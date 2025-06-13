"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "@/app/store/reducer";
import { getDailyLogs } from "../../state/actions";
import { Calendar } from "@/components/ui";

function mapStateToProps(state: RootState) {
  return {
    dailyLogs: state.health.dailyLogs,
    dailyLogsLoading: state.health.dailyLogsLoading,
  };
}

const connector = connect(mapStateToProps, { getDailyLogs });
type PropsFromRedux = ConnectedProps<typeof connector>;

const WeightLog: React.FC<PropsFromRedux> = ({
  dailyLogs,
  dailyLogsLoading,
  getDailyLogs,
}) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  React.useEffect(() => {
    if (!dailyLogs && !dailyLogsLoading) {
      getDailyLogs();
    }
  }, [dailyLogs, dailyLogsLoading, getDailyLogs]);

  const isoDate = date?.toLocaleDateString("sv-SE", {
    timeZone: "America/New_York",
  });

  const activeLog = dailyLogs?.find((log) => log.date === isoDate);

  return (
    <div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow-sm w-full h-full"
        captionLayout="dropdown"
        dataDates={dailyLogs?.map((log) => new Date(log.date))}
      />
      {activeLog ? <h1>Weight: {activeLog.weight}</h1> : <h1>No log</h1>}
    </div>
  );
};

export default connector(WeightLog);
