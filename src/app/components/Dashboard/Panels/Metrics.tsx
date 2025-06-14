"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../store/reducer";
import { DashboardButton } from "../components/Button";
import {
  WeightForm,
  BodyfatForm,
  CaloriesForm,
  // SleepForm,
  StepsForm,
  WaterForm,
} from "@/app/(secure)/health/logs/components/Forms";
import {
  editDailyWeight,
  editDailySteps,
  editDailyBodyfat,
  editDailyCalories,
  editDailyWater,
  getDailySleep,
} from "../../../(secure)/health/state/actions";
import { convertTime } from "../../../components/Time";
import { DateTime } from "luxon";

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
    dietLog: state.health.dietLog,
    dietLogLoading: state.health.dietLogLoading,
    dietSupplements: state.health.dietSupplements,
  };
}

const connector = connect(mapStateToProps, {
  editDailyWeight,
  editDailySteps,
  editDailyBodyfat,
  editDailyCalories,
  editDailyWater,
  getDailySleep,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const Metrics: React.FC<PropsFromRedux> = ({
  dailyLogs,
  dailyLogsLoading,
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
  dietLog,
  dietLogLoading,
}) => {
  const today = DateTime.now().toISODate();
  const todayLog = dailyLogs?.find((d) => d.date === today);
  const yesterday = DateTime.now().minus({ days: 1 }).toISODate();
  const yesterdayLog = dailyLogs?.find((d) => d.date === yesterday);

  return (
    <div className="w-full md:w-[400px] shrink-0">
      <div className="grid grid-cols-2 grid-rows-2 gap-2 p-2 h-full w-full border-2 rounded-md">
        <WeightForm
          Trigger={
            <DashboardButton
              header="Weight"
              subheader="lbs"
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
              subheader="% bodyfat"
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
              loading={
                !dailyLogs ||
                dailyLogsLoading ||
                editWaterLoading ||
                dietLogLoading
              }
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
              data={
                todayLog?.calories
                  ? `${Math.floor(todayLog.calories)} cal`
                  : "0 cal"
              }
              loading={
                !dailyLogs ||
                dailyLogsLoading ||
                editCaloriesLoading ||
                dietLogLoading
              }
            />
          }
          initialValues={{
            calories: todayLog?.calories || 0,
          }}
          handleSubmit={(values: { calories: number }) =>
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
    </div>
  );
};

export default connector(Metrics);
