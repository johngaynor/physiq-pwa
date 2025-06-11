"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../store/reducer";
import { H4, Checkbox, Spinner } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardButton } from "./components/Button";
import {
  BodyfatForm,
  CaloriesForm,
  // SleepForm,
  StepsForm,
  WaterForm,
  WeightForm,
} from "./components/Forms";
import {
  getDailyLogs,
  editDailyWeight,
  editDailySteps,
  getSupplements,
  getSupplementLogs,
  toggleSupplementLog,
  editDailyBodyfat,
  editDailyCalories,
  editDailyWater,
  getDailySleep,
  getDietLogs,
} from "../Health/state/actions";
import { DateTime } from "luxon";
import { convertTime } from "../components/Time";

function mapStateToProps(state: RootState) {
  return {
    dailyLogs: state.health.dailyLogs,
    dailyLogsLoading: state.health.dailyLogsLoading,
    editWeightLoading: state.health.editWeightLoading,
    editStepsLoading: state.health.editStepsLoading,
    editBodyfatLoading: state.health.editBodyfatLoading,
    editWaterLoading: state.health.editWaterLoading,
    editCaloriesLoading: state.health.editCaloriesLoading,
    editSleepLoading: state.health.editSleepLoading,
    supplements: state.health.supplements,
    supplementsLoading: state.health.supplementsLoading,
    supplementLogs: state.health.supplementLogs,
    supplementLogsLoading: state.health.supplementLogsLoading,
    dietLogs: state.health.dietLogs,
    dietLogsLoading: state.health.dietLogsLoading,
  };
}

const connector = connect(mapStateToProps, {
  getDailyLogs,
  editDailyWeight,
  editDailySteps,
  editDailyBodyfat,
  getSupplements,
  getSupplementLogs,
  toggleSupplementLog,
  editDailyCalories,
  editDailyWater,
  getDailySleep,
  getDietLogs,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const Dashboard: React.FC<PropsFromRedux> = ({
  dailyLogs,
  dailyLogsLoading,
  getDailyLogs,
  editWeightLoading,
  editDailyWeight,
  editStepsLoading,
  editDailySteps,
  editBodyfatLoading,
  editDailyBodyfat,
  editWaterLoading,
  editDailyWater,
  editCaloriesLoading,
  editDailyCalories,
  editSleepLoading,
  getDailySleep,
  supplements,
  supplementsLoading,
  getSupplements,
  supplementLogs,
  supplementLogsLoading,
  getSupplementLogs,
  toggleSupplementLog,
  getDietLogs,
  dietLogs,
  dietLogsLoading,
}) => {
  React.useEffect(() => {
    if (!dailyLogsLoading && !dailyLogs) getDailyLogs();
    if (!supplementsLoading && !supplements) getSupplements();
    if (!supplementLogsLoading && !supplementLogs) getSupplementLogs();
    if (!dietLogsLoading && !dietLogs) getDietLogs();
  });

  const today = DateTime.now().toISODate();
  const todayLog = dailyLogs?.find((d) => d.date === today);
  const yesterday = DateTime.now().minus({ days: 1 }).toISODate();
  const yesterdayLog = dailyLogs?.find((d) => d.date === yesterday);

  const dietLog = dietLogs?.[0];

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
              loading={!dailyLogs || dailyLogsLoading || editWeightLoading}
            />
          }
          initialValues={{
            weight: todayLog?.weight || "",
          }}
          handleSubmit={(values: { weight: number | string }) =>
            editDailyWeight(today, Number(values.weight))
          }
        />
        <StepsForm
          Trigger={
            <DashboardButton
              header="Steps"
              subheader="steps yesterday"
              data={yesterdayLog?.steps}
              loading={!dailyLogs || dailyLogsLoading || editStepsLoading}
            />
          }
          initialValues={{
            steps: yesterdayLog?.steps || "",
          }}
          handleSubmit={(values: { steps: number | string }) =>
            editDailySteps(yesterday, Number(values.steps))
          }
        />
        {/* Temporarily removing sleep form and replacing with button */}
        {/* <SleepForm
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
        /> */}
        <DashboardButton
          header="Sleep"
          subheader="last night"
          data={convertTime(todayLog?.totalSleep || 0)}
          loading={!dailyLogs || dailyLogsLoading || editSleepLoading}
          onClick={() => getDailySleep(today)}
        />
        <BodyfatForm
          Trigger={
            <DashboardButton
              header="Bodyfat %"
              subheader="% bodyfat this AM"
              data={todayLog?.bodyfat}
              loading={!dailyLogs || dailyLogsLoading || editBodyfatLoading}
            />
          }
          initialValues={{
            bodyfat: todayLog?.bodyfat || "",
          }}
          handleSubmit={(values: { bodyfat: number | string }) =>
            editDailyBodyfat(today, Number(values.bodyfat))
          }
        />
        <WaterForm
          Trigger={
            <DashboardButton
              header="Water"
              subheader={
                dietLog?.water ? `/ ${dietLog.water}oz` : "No goal set"
              }
              data={todayLog?.water ? `${todayLog.water} oz` : "0 oz"}
              loading={!dailyLogs || dailyLogsLoading || editWaterLoading}
            />
          }
          initialValues={{
            water: todayLog?.water || "",
          }}
          handleSubmit={(values: { water: number | string }) =>
            editDailyWater(today, Number(values.water))
          }
        />
        <CaloriesForm
          Trigger={
            <DashboardButton
              header="Calories"
              subheader={
                dietLog?.calories ? `/ ${dietLog.calories} cal` : "No goal set"
              }
              data={todayLog?.calories ? `${todayLog.calories} cal` : "0 cal"}
              loading={!dailyLogs || dailyLogsLoading || editCaloriesLoading}
            />
          }
          initialValues={{
            calories: todayLog?.calories || "",
          }}
          handleSubmit={(values: { calories: number | string }) =>
            editDailyCalories(today, Number(values.calories))
          }
        />
        {/* Removing training temporarily */}
        {/* <DashboardButton
          header="Training"
          subheader="Today's training"
          onClick={() => alert("functionality not here yet womp womp")}
        /> */}
      </div>
      <div className="border-2 p-2 rounded-md mt-2 min-h-[100px] flex justify-center items-center">
        {!supplements ||
        !supplementLogs ||
        supplementsLoading ||
        supplementLogsLoading ? (
          <Spinner size="large" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Supplement</TableHead>
                <TableHead>Dosage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supplements.map((supp) => (
                <TableRow key={supp.id}>
                  <TableCell className="font-medium">
                    <Checkbox
                      checked={
                        supplementLogs?.find(
                          (l) => l.date === today && l.supplementId === supp.id
                        )?.completed
                      }
                      onCheckedChange={(checked) =>
                        toggleSupplementLog(today, supp.id, Boolean(checked))
                      }
                    />
                  </TableCell>
                  <TableCell>{supp.name}</TableCell>
                  <TableCell>{supp.dosage}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default connector(Dashboard);
