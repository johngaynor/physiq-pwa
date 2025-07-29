"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../store/reducer";
import { DashboardButton } from "./DashboardButton";

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
}) => {
  const today = DateTime.now().toISODate();
  const todayLog = dailyLogs?.find((d) => d.date === today);
  const yesterday = DateTime.now().minus({ days: 1 }).toISODate();
  const yesterdayLog = dailyLogs?.find((d) => d.date === yesterday);

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
            <DashboardButton
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
          subheader="Track your steps from yesterday."
          currentValue={yesterdayLog?.steps || ""}
          onUpdate={(newValue: number) => {
            editDailySteps(yesterday, newValue);
          }}
          increment={1000}
          Trigger={
            <DashboardButton
              header="Steps"
              subheader="steps yesterday"
              data={yesterdayLog?.steps}
              loading={!dailyLogs || dailyLogsLoading || editStepsLoading}
            />
          }
          defaultReplace
        />
        {/* sleep, currently no form */}
        <DashboardButton
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
            <DashboardButton
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
          subheader="Track your water intake throughout the day."
          currentValue={todayLog?.water || 0}
          onUpdate={(newValue: number) => {
            editDailyWater(today, newValue);
          }}
          increment={8}
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
        />
        <DrawerWrapper
          header="Add/Subtract Calories"
          subheader="Track your calories throughout the day."
          currentValue={todayLog?.calories || 0}
          onUpdate={(newValue: number) => {
            editDailyCalories(today, newValue);
          }}
          increment={100}
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
        />
      </div>
    </div>
  );
};

export default connector(MetricsPanel);
