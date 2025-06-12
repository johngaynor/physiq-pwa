"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducer";
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
  getLatestDietLog,
} from "../../health/state/actions";
import Metrics from "./Panels/Metrics";
import Supplements from "./Panels/Supplements";
import { H4 } from "@/components/ui";

function mapStateToProps(state: RootState) {
  return {
    dailyLogs: state.health.dailyLogs,
    dailyLogsLoading: state.health.dailyLogsLoading,
    supplements: state.health.supplements,
    supplementsLoading: state.health.supplementsLoading,
    supplementLogs: state.health.supplementLogs,
    supplementLogsLoading: state.health.supplementLogsLoading,
    dietLog: state.health.dietLog,
    dietLogLoading: state.health.dietLogLoading,
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
  getLatestDietLog,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const Dashboard: React.FC<PropsFromRedux> = ({
  dailyLogs,
  dailyLogsLoading,
  getDailyLogs,
  supplements,
  supplementsLoading,
  getSupplements,
  supplementLogs,
  supplementLogsLoading,
  getSupplementLogs,
  getLatestDietLog,
  dietLog,
  dietLogLoading,
}) => {
  React.useEffect(() => {
    if (!dailyLogsLoading && !dailyLogs) getDailyLogs();
    if (!supplementsLoading && !supplements) getSupplements();
    if (!supplementLogsLoading && !supplementLogs) getSupplementLogs();
    if (!dietLogLoading && !dietLog) getLatestDietLog();
  });

  return (
    <div>
      <H4 className="py-4">Today</H4>
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <Metrics />
        <Supplements />
      </div>
    </div>
  );
};

export default connector(Dashboard);
