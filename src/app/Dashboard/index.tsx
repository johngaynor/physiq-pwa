"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../store/reducer";
import { H4, Checkbox } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardButton } from "./components/Button";
import { SleepForm, StepsForm, WeightForm } from "./components/Forms";
import { SupplementData } from "../Health/testdata";
import { getDailyLogs } from "../Health/state/actions";
import { DateTime } from "luxon";
import { convertTime } from "../components/Time";

function mapStateToProps(state: RootState) {
  return {
    dailyLogs: state.health.dailyLogs,
    dailyLogsLoading: state.health.dailyLogsLoading,
  };
}

const connector = connect(mapStateToProps, { getDailyLogs });
type PropsFromRedux = ConnectedProps<typeof connector>;

const Dashboard: React.FC<PropsFromRedux> = ({
  dailyLogs,
  dailyLogsLoading,
  getDailyLogs,
}) => {
  React.useEffect(() => {
    if (!dailyLogsLoading && !dailyLogs) getDailyLogs();
  }, [dailyLogs, dailyLogsLoading, getDailyLogs]);

  const today = DateTime.now().toISODate();
  const todayLog = dailyLogs?.find((d) => d.date === today);
  const yesterday = DateTime.now().minus({ days: 1 }).toISODate();
  const yesterdayLog = dailyLogs?.find((d) => d.date === yesterday);

  function handleSubmitWeight(values: { weight: number | string }) {
    alert(
      JSON.stringify({ ...values, date: new Date().toISOString() }, null, 2)
    );
  }

  function handleSubmitSteps(values: { steps: number | string }) {
    alert(
      JSON.stringify({ ...values, date: new Date().toISOString() }, null, 2)
    );
  }

  function handleSubmitSleep(values: {
    totalSleep: number | string;
    totalBed: number | string;
    awakeQty: number | string;
    lightQty: number | string;
    remQty: number | string;
    deepQty: number | string;
  }) {
    alert(
      JSON.stringify({ ...values, date: new Date().toISOString() }, null, 2)
    );
  }

  return (
    <div className="py-4">
      <H4 className="pb-4">Today</H4>
      <div className="grid grid-cols-2 grid-rows-2 gap-2 p-2 h-full w-full border-2 rounded-md">
        <WeightForm
          Trigger={
            <DashboardButton
              header="Weight"
              subheader="lbs this AM"
              data={todayLog?.weight}
              loading={!dailyLogs || dailyLogsLoading}
            />
          }
          initialValues={{
            weight: todayLog?.weight || "",
          }}
          handleSubmit={handleSubmitWeight}
        />
        <StepsForm
          Trigger={
            <DashboardButton
              header="Steps"
              subheader="steps yesterday"
              data={yesterdayLog?.steps}
              loading={!dailyLogs || dailyLogsLoading}
            />
          }
          initialValues={{
            steps: yesterdayLog?.steps || "",
          }}
          handleSubmit={handleSubmitSteps}
        />
        <SleepForm
          Trigger={
            <DashboardButton
              header="Sleep"
              subheader="last night"
              data={convertTime(todayLog?.totalSleep || 0)}
              loading={!dailyLogs || dailyLogsLoading}
            />
          }
          initialValues={{
            totalSleep: todayLog?.totalSleep || "",
            totalBed: todayLog?.totalBed || "",
            awakeQty: todayLog?.awakeQty || "",
            lightQty: todayLog?.lightQty || "",
            deepQty: todayLog?.deepQty || "",
            remQty: todayLog?.remQty || "",
          }}
          handleSubmit={handleSubmitSleep}
        />
        <DashboardButton
          header="Training"
          subheader="Today's training"
          onClick={() => alert("functionality not here yet womp womp")}
        />
      </div>
      <div className="border-2 p-2 rounded-md mt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Supplement</TableHead>
              <TableHead>Dosage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SupplementData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <Checkbox checked={item.checked} />
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.dosage}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default connector(Dashboard);
