"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "@/app/store/reducer";
import { getDailyLogs, editDailyWeight } from "../../state/actions";
import { Button, Calendar, H1, H3 } from "@/components/ui";
import { CirclePlus } from "lucide-react";
import { ChartLineMultiple } from "../components/Graphs/ChartLineMultiple";
import { WeightForm } from "../components/Forms/WeightForm";
import { DateTime } from "luxon";
import LogsLoadingPage from "../components/Pages/LogsLoadingPage";

function mapStateToProps(state: RootState) {
  return {
    dailyLogs: state.health.dailyLogs,
    dailyLogsLoading: state.health.dailyLogsLoading,
    editWeightLoading: state.health.editWeightLoading,
  };
}

const connector = connect(mapStateToProps, { getDailyLogs, editDailyWeight });
type PropsFromRedux = ConnectedProps<typeof connector>;

const WeightLog: React.FC<PropsFromRedux> = ({
  dailyLogs,
  dailyLogsLoading,
  getDailyLogs,
  editDailyWeight,
  editWeightLoading,
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

  const activeLog = dailyLogs?.find(
    (log) => log.date === isoDate && log.weight
  );

  if (dailyLogsLoading || editWeightLoading) return <LogsLoadingPage />;

  return (
    <div className="flex w-full gap-4 h-full md:flex-row flex-col">
      <div className="flex-shrink-0">
        <div className="flex flex-col gap-4 h-full justify-between">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow-sm flex-grow"
            captionLayout="dropdown"
            dataDates={dailyLogs
              ?.filter((d) => d.weight)
              .map((log) => new Date(log.date))}
          />
          <WeightForm
            Trigger={
              <Button variant="outline" className="w-full h-20">
                {activeLog ? (
                  <H1>{activeLog.weight?.toFixed(1)} lbs</H1>
                ) : (
                  <div className="flex">
                    <CirclePlus className="size-8 font-extrabold" />
                    <H3 className="pl-2">Add Weight</H3>
                  </div>
                )}
              </Button>
            }
            initialValues={{
              weight: activeLog?.weight || "",
            }}
            handleSubmit={(values: { weight: number | string }) =>
              editDailyWeight(
                isoDate || DateTime.now().toISODate(),
                Number(values.weight)
              )
            }
          />
        </div>
      </div>
      <div className="w-full md:pb-0 pb-10">
        <ChartLineMultiple
          dailyLogs={dailyLogs}
          title="Morning Weight"
          unit="lbs"
          showUnit
          dataKey="weight"
          rounding={1}
        />
      </div>
    </div>
  );
};

export default connector(WeightLog);
