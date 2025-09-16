"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../store/reducer";
import { DashboardButtonSmall } from "./DashboardButtons";

import {
  editDailyWeight,
  editDailySteps,
  editDailyBodyfat,
  editDailyCalories,
  editDailyWater,
  getDailySleep,
} from "../../health/state/actions";
import { convertTime } from "../../../components/Time";
import { DateTime } from "luxon";
import { DrawerWrapper } from "./DrawerForms/DrawerWrapper";

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
    dietLog: state.diet.dietLog,
    dietLogLoading: state.diet.dietLogLoading,
    dietSupplements: state.diet.dietSupplements,
    user: state.app.user,
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

const MetricsPanel: React.FC<PropsFromRedux> = ({
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
  user,
}) => {
  const today = DateTime.now().toISODate();
  const todayLog = dailyLogs?.find((d) => d.date === today);
  const yesterday = DateTime.now().minus({ days: 1 }).toISODate();
  const yesterdayLog = dailyLogs?.find((d) => d.date === yesterday);

  const caloriesToday = Boolean(user?.settings.dashboardCaloriesToday);
  const stepsToday = Boolean(user?.settings.dashboardStepsToday);
  const waterToday = Boolean(user?.settings.dashboardWaterToday);

  return (
    <div className="w-full md:w-[400px] shrink-0">
      <div className="grid grid-cols-2 gap-2 p-2 h-full w-full border-2 rounded-md">
        <DrawerWrapper
          header="Add/Subtract Weight"
          subheader="Track your weight."
          currentValue={todayLog?.weight || ""}
          onUpdate={(newValue: number) => {
            editDailyWeight(today, newValue);
          }}
          increment={0.1}
          Trigger={
            <DashboardButtonSmall
              header="Weight"
              subheader="lbs"
              data={
                todayLog && todayLog.weight ? todayLog.weight.toFixed(1) : ""
              }
              loading={!dailyLogs || dailyLogsLoading || editWeightLoading}
            />
          }
          defaultReplace
        />
        <DrawerWrapper
          header="Add/Subtract Steps"
          subheader={`Track your steps from ${
            stepsToday ? "today" : "yesterday"
          }.`}
          currentValue={
            stepsToday ? todayLog?.steps || "" : yesterdayLog?.steps || ""
          }
          onUpdate={(newValue: number) => {
            editDailySteps(stepsToday ? today : yesterday, newValue);
          }}
          increment={1000}
          Trigger={
            <DashboardButtonSmall
              header="Steps"
              subheader={`steps ${stepsToday ? "today" : "yesterday"}`}
              data={stepsToday ? todayLog?.steps : yesterdayLog?.steps}
              loading={!dailyLogs || dailyLogsLoading || editStepsLoading}
            />
          }
          defaultReplace
        />
        {/* sleep, currently no form */}
        <DashboardButtonSmall
          header="Sleep"
          subheader="last night"
          data={convertTime(todayLog?.totalSleep || 0)}
          loading={!dailyLogs || dailyLogsLoading || editSleepLoading}
          onClick={() => getDailySleep(today)}
        />
        <DrawerWrapper
          header="Add/Subtract Bodyfat"
          subheader="Track your bodyfat percentage."
          currentValue={todayLog?.bodyfat || ""}
          onUpdate={(newValue: number) => {
            editDailyBodyfat(today, newValue);
          }}
          increment={0.5}
          Trigger={
            <DashboardButtonSmall
              header="Bodyfat %"
              subheader="% bodyfat"
              data={todayLog?.bodyfat}
              loading={!dailyLogs || dailyLogsLoading || editBodyfatLoading}
            />
          }
          defaultReplace
        />
        <DrawerWrapper
          header="Add/Subtract Water"
          subheader={`Track your water intake from ${
            waterToday ? "today" : "yesterday"
          }.`}
          currentValue={
            waterToday ? todayLog?.water || "" : yesterdayLog?.water || ""
          }
          onUpdate={(newValue: number) => {
            editDailyWater(waterToday ? today : yesterday, newValue);
          }}
          increment={8}
          Trigger={
            <DashboardButtonSmall
              header="Water"
              subheader={
                dietLog?.water ? `/ ${dietLog.water}oz` : "No goal set"
              }
              data={
                waterToday
                  ? `${todayLog?.water || 0} oz`
                  : `${yesterdayLog?.water || 0} oz`
              }
              loading={
                !dailyLogs ||
                dailyLogsLoading ||
                editWaterLoading ||
                dietLogLoading
              }
            />
          }
          defaultReplace={!Boolean(user?.settings.dashboardWaterAdd)}
        />
        <DrawerWrapper
          header="Add/Subtract Calories"
          subheader={`Track your calories from ${
            caloriesToday ? "today" : "yesterday"
          }.`}
          currentValue={
            caloriesToday
              ? todayLog?.calories || ""
              : yesterdayLog?.calories || ""
          }
          onUpdate={(newValue: number) => {
            editDailyCalories(caloriesToday ? today : yesterday, newValue);
          }}
          increment={100}
          Trigger={
            <DashboardButtonSmall
              header="Calories"
              subheader={
                dietLog?.calories ? `/ ${dietLog.calories} cal` : "No goal set"
              }
              data={
                caloriesToday
                  ? `${Math.floor(todayLog?.calories || 0)} cal`
                  : `${Math.floor(yesterdayLog?.calories || 0)} cal`
              }
              loading={
                !dailyLogs ||
                dailyLogsLoading ||
                editCaloriesLoading ||
                dietLogLoading
              }
            />
          }
          defaultReplace={!Boolean(user?.settings.dashboardCaloriesAdd)}
        />
      </div>
    </div>
  );
};

export default connector(MetricsPanel);
