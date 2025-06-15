"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "@/app/store/reducer";
import { getDailyLogs, editDailySteps } from "../../state/actions";
import { Button, Calendar, H1, H3 } from "@/components/ui";
import { CirclePlus } from "lucide-react";
import { ChartLineMultiple } from "../components/Graphs/ChartLineMultiple";
import { StepsForm } from "../components/Forms";
import { DateTime } from "luxon";
import LogsLoadingPage from "../components/Pages/LogsLoadingPage";

function mapStateToProps(state: RootState) {
  return {
    dailyLogs: state.health.dailyLogs,
    dailyLogsLoading: state.health.dailyLogsLoading,
    editStepsLoading: state.health.editStepsLoading,
  };
}

const connector = connect(mapStateToProps, { getDailyLogs, editDailySteps });
type PropsFromRedux = ConnectedProps<typeof connector>;

const StepsLog: React.FC<PropsFromRedux> = ({
  dailyLogs,
  dailyLogsLoading,
  getDailyLogs,
  editDailySteps,
  editStepsLoading,
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

  const activeLog = dailyLogs?.find((log) => log.date === isoDate && log.steps);

  if (dailyLogsLoading || editStepsLoading) return <LogsLoadingPage />;
  return (
    <>
      <div>
        <div className="flex flex-col gap-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow-sm"
            captionLayout="dropdown"
            dataDates={dailyLogs
              ?.filter((d) => d.steps)
              .map((log) => new Date(log.date))}
          />
          <StepsForm
            Trigger={
              <Button variant="outline" className="w-full h-20">
                {activeLog ? (
                  <H1>{activeLog.steps} lbs</H1>
                ) : (
                  <div className="flex">
                    <CirclePlus className="size-8 font-extrabold" />
                    <H3 className="pl-2">Add Steps</H3>
                  </div>
                )}
              </Button>
            }
            initialValues={{
              steps: activeLog?.steps || "",
            }}
            handleSubmit={(values: { steps: number | string }) =>
              editDailySteps(
                isoDate || DateTime.now().toISODate(),
                Number(values.steps)
              )
            }
          />
        </div>
      </div>
      <div className="w-full md:pb-0 pb-10">
        <ChartLineMultiple
          dailyLogs={dailyLogs}
          title="Daily Steps"
          unit="steps"
          dataKey="steps"
          rounding={1000}
        />
      </div>
    </>
  );
};

export default connector(StepsLog);
