"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "@/app/store/reducer";
import { getDailyLogs, editDailyBodyfat } from "../../state/actions";
import { Button, Calendar, H1, H3 } from "@/components/ui";
import { Skeleton } from "@/components/ui";
import { CirclePlus } from "lucide-react";
import { ChartLineMultiple } from "../components/Graphs/ChartLineMultiple";
import { BodyfatForm, StepsForm } from "../components/Forms";
import { DateTime } from "luxon";

function mapStateToProps(state: RootState) {
  return {
    dailyLogs: state.health.dailyLogs,
    dailyLogsLoading: state.health.dailyLogsLoading,
    editBodyfatLoading: state.health.editBodyfatLoading,
  };
}

const connector = connect(mapStateToProps, { getDailyLogs, editDailyBodyfat });
type PropsFromRedux = ConnectedProps<typeof connector>;

const BodyfatLog: React.FC<PropsFromRedux> = ({
  dailyLogs,
  dailyLogsLoading,
  getDailyLogs,
  editDailyBodyfat,
  editBodyfatLoading,
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
    (log) => log.date === isoDate && log.bodyfat
  );

  return (
    <>
      <div>
        {dailyLogsLoading || editBodyfatLoading ? (
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
              className="rounded-md border shadow-sm"
              captionLayout="dropdown"
              dataDates={dailyLogs
                ?.filter((d) => d.bodyfat)
                .map((log) => new Date(log.date))}
            />
            <BodyfatForm
              Trigger={
                <Button variant="outline" className="w-full h-20">
                  {activeLog ? (
                    <H1>{activeLog.bodyfat} %</H1>
                  ) : (
                    <div className="flex">
                      <CirclePlus className="size-8 font-extrabold" />
                      <H3 className="pl-2">Add Bodyfat %</H3>
                    </div>
                  )}
                </Button>
              }
              initialValues={{
                bodyfat: activeLog?.bodyfat || "",
              }}
              handleSubmit={(values: { bodyfat: number | string }) =>
                editDailyBodyfat(
                  isoDate || DateTime.now().toISODate(),
                  Number(values.bodyfat)
                )
              }
            />
          </div>
        )}
      </div>
      <div className="w-full">
        <ChartLineMultiple
          dailyLogs={dailyLogs}
          title="Morning Bodyfat %"
          unit="%"
          dataKey="bodyfat"
          rounding={1}
        />
      </div>
    </>
  );
};

export default connector(BodyfatLog);
