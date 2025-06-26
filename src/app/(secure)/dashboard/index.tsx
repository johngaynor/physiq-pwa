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
} from "../health/state/actions";
import PageTemplate from "../components/Templates/PageTemplate";
import MetricsPanel from "./components/MetricsPanel";
import SupplementsPanel from "./components/SupplementsPanel";

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
    <PageTemplate title="Today">
      <div className="w-full flex flex-col md:flex-row gap-4 mb-20">
        <MetricsPanel />
        <div className="w-full gap-4 flex flex-col">
          <SupplementsPanel />
          <div className="rounded-md h-1/2 flex justify-center items-center w-full w-max-lg grid grid-cols-2 gap-4">
            <div className="border-2 rounded-md flex justify-center items-center w-full h-full">
              hi
            </div>
            <div className="border-2 rounded-md flex justify-center items-center w-full h-full">
              hi
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default connector(Dashboard);
