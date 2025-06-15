"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "@/app/store/reducer";
import { getDailyLogs, editDailyWater } from "../../state/actions";
import { Button, Calendar, H1, H3 } from "@/components/ui";
import { CirclePlus } from "lucide-react";
import { ChartLineMultiple } from "../components/Graphs/ChartLineMultiple";
import { WaterForm } from "../components/Forms";
import { DateTime } from "luxon";
import LogsLoadingPage from "../components/Pages/LogsLoadingPage";

function mapStateToProps(state: RootState) {
  return {
    dailyLogs: state.health.dailyLogs,
    dailyLogsLoading: state.health.dailyLogsLoading,
    editWaterLoading: state.health.editWaterLoading,
  };
}

const connector = connect(mapStateToProps, { getDailyLogs, editDailyWater });
type PropsFromRedux = ConnectedProps<typeof connector>;

const WaterLog: React.FC<PropsFromRedux> = ({
  dailyLogs,
  dailyLogsLoading,
  getDailyLogs,
  editDailyWater,
  editWaterLoading,
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

  const activeLog = dailyLogs?.find((log) => log.date === isoDate && log.water);

  if (dailyLogsLoading || editWaterLoading) return <LogsLoadingPage />;
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
              ?.filter((d) => d.water)
              .map((log) => new Date(log.date))}
          />
          <WaterForm
            Trigger={
              <Button variant="outline" className="w-full h-20">
                {activeLog ? (
                  <H1>{activeLog.water} oz</H1>
                ) : (
                  <div className="flex">
                    <CirclePlus className="size-8 font-extrabold" />
                    <H3 className="pl-2">Add Water</H3>
                  </div>
                )}
              </Button>
            }
            initialValues={{
              water: activeLog?.water || "",
            }}
            handleSubmit={(values: { water: number | string }) =>
              editDailyWater(
                isoDate || DateTime.now().toISODate(),
                Number(values.water)
              )
            }
          />
        </div>
      </div>
      <div className="w-full md:pb-0 pb-10">
        <ChartLineMultiple
          dailyLogs={dailyLogs}
          title="Daily Water Intake"
          unit="oz"
          dataKey="water"
          rounding={10}
          showUnit
        />
      </div>
    </>
  );
};

export default connector(WaterLog);
