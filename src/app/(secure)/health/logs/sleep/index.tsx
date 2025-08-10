"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "@/app/store/reducer";
import { getSleepLogs } from "../../state/actions";
import { Button, Calendar, H1, H3 } from "@/components/ui";
import { CirclePlus } from "lucide-react";
import { ChartLineMultiple } from "../components/Graphs/ChartLineMultiple";
import { SleepForm } from "../components/Forms";
import LogsLoadingPage from "../components/Pages/LogsLoadingPage";
import { convertTime } from "@/app/components/Time";

function mapStateToProps(state: RootState) {
  return {
    sleepLogs: state.health.sleepLogs,
    sleepLogsLoading: state.health.sleepLogsLoading,
  };
}

const connector = connect(mapStateToProps, { getSleepLogs });
type PropsFromRedux = ConnectedProps<typeof connector>;

const SleepLog: React.FC<PropsFromRedux> = ({
  sleepLogs,
  sleepLogsLoading,
  getSleepLogs,
}) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  React.useEffect(() => {
    if (!sleepLogs && !sleepLogsLoading) {
      getSleepLogs();
    }
  }, [sleepLogs, sleepLogsLoading, getSleepLogs]);

  const isoDate = date?.toLocaleDateString("sv-SE", {
    timeZone: "America/New_York",
  });

  const activeLog = sleepLogs?.find((log) => log.date === isoDate);

  if (sleepLogsLoading) return <LogsLoadingPage />;

  return (
    <>
      <div className="flex flex-col gap-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border shadow-sm"
          captionLayout="dropdown"
          dataDates={sleepLogs?.map((log) => new Date(log.date))}
        />
        <SleepForm
          Trigger={
            <Button variant="outline" className="w-full h-20">
              {activeLog ? (
                <H1>
                  {activeLog.totalSleep
                    ? convertTime(activeLog.totalSleep)
                    : "--"}
                </H1>
              ) : (
                <div className="flex">
                  <CirclePlus className="size-8 font-extrabold" />
                  <H3 className="pl-2">Add Sleep</H3>
                </div>
              )}
            </Button>
          }
          initialValues={{
            totalSleep: activeLog?.totalSleep || "",
            totalBed: activeLog?.totalBed || "",
            awakeQty: activeLog?.awakeQty || "",
            lightQty: activeLog?.lightQty || "",
            remQty: activeLog?.remQty || "",
            deepQty: activeLog?.deepQty || "",
          }}
          handleSubmit={(values) =>
            alert(
              "Sorry, this feature is not implemented yet!" +
                JSON.stringify(values)
            )
          }
        />
      </div>
      <div className="w-full md:pb-0 pb-10">
        <ChartLineMultiple
          dailyLogs={sleepLogs}
          title="Daily Total Sleep"
          dataKey="totalSleep"
          unit=""
          rounding={1}
        />
      </div>
    </>
  );
};

export default connector(SleepLog);
