"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "@/app/store/reducer";
import { getDailyLogs } from "../../state/actions";
import { Button, Calendar, H1, H3 } from "@/components/ui";
import { Skeleton } from "@/components/ui";
import { CirclePlus } from "lucide-react";

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
    <>
      <div>
        {dailyLogsLoading ? (
          <div className="flex flex-col space-y-3 md:w-[200px] w-full">
            <Skeleton className="h-[400px] w-full rounded-xl" />
            <Skeleton className="h-[50px] w-full rounded-xl" />
          </div>
        ) : (
          <>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow-sm w-full h-auto"
              captionLayout="dropdown"
              dataDates={dailyLogs?.map((log) => new Date(log.date))}
            />
            <Button
              variant="outline"
              className="w-full mt-2 h-20"
              onClick={() =>
                alert("Sorry, this functionality is not available yet.")
              }
            >
              {activeLog && activeLog?.weight ? (
                <H1>{activeLog.weight.toFixed(1)} lbs</H1>
              ) : (
                <div className="flex">
                  <CirclePlus className="size-8 font-extrabold" />
                  <H3 className="pl-2">Add Weight</H3>
                </div>
              )}
            </Button>
          </>
        )}
      </div>
      <div>{/* <h1>[GRAPH]</h1> */}</div>
    </>
  );
};

export default connector(WeightLog);
