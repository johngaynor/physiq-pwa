"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "@/app/store/reducer";
import { getDailyLogs } from "../../state/actions";
import { Button, Calendar, H1, H3 } from "@/components/ui";
import { Skeleton } from "@/components/ui";
import { CirclePlus } from "lucide-react";
import { ChartLineMultiple } from "../components/ChartLineMultiple";

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
          <div className="flex flex-col space-y-3 md:w-[250px] w-full">
            <Skeleton className="h-[340px] w-full rounded-xl" />
            <Skeleton className="h-[50px] w-full rounded-xl" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow-sm md:w-full"
              captionLayout="dropdown"
              dataDates={dailyLogs?.map((log) => new Date(log.date))}
            />
            <Button
              variant="outline"
              className="w-full h-20"
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
          </div>
        )}
      </div>
      <div className="w-full">
        <ChartLineMultiple dailyLogs={dailyLogs} />
      </div>
    </>
  );
};

export default connector(WeightLog);
