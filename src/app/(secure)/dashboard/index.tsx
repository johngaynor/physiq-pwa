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
} from "../health/state/actions";
import { getLatestDietLog } from "../diet/state/actions";
import PageTemplate from "../components/Templates/PageTemplate";
import MetricsPanel from "./components/MetricsPanel";
import SupplementsPanel from "./components/SupplementsPanel";
import { DashboardButtonLarge } from "./components/DashboardButtons";

function mapStateToProps(state: RootState) {
  return {
    dailyLogs: state.health.dailyLogs,
    dailyLogsLoading: state.health.dailyLogsLoading,
    supplements: state.health.supplements,
    supplementsLoading: state.health.supplementsLoading,
    supplementLogs: state.health.supplementLogs,
    supplementLogsLoading: state.health.supplementLogsLoading,
    dietLog: state.diet.dietLog,
    dietLogLoading: state.diet.dietLogLoading,
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
    <PageTemplate title="Today" showTitleMobile>
      <div className="w-full flex flex-col gap-4">
        {/* Mobile layout (below md/768px) - everything stacked vertically */}
        <div className="flex flex-col gap-4 md:hidden">
          <MetricsPanel />
          <SupplementsPanel />
          <DashboardButtonLarge
            label="Check-ins"
            header="Check-ins not enabled for your account."
            subheader="If you believe this is an error, please contact support."
            size="small"
          />
          <DashboardButtonLarge
            label="Training"
            header="Training not enabled for your account."
            subheader="If you believe this is an error, please contact support."
            size="small"
          />
        </div>

        {/* Tablet layout (md to lg: 768px-1023px) - metrics left, his stacked right, supplements bottom */}
        <div className="hidden md:flex lg:hidden flex-col gap-4">
          <div className="flex flex-row gap-4">
            <MetricsPanel />
            <div className="w-full gap-4 flex flex-col">
              <DashboardButtonLarge
                label="Check-ins"
                header="Check-ins not enabled for your account."
                subheader="If you believe this is an error, please contact support."
              />
              <DashboardButtonLarge
                label="Training"
                header="Training not enabled for your account."
                subheader="If you believe this is an error, please contact support."
              />
            </div>
          </div>
          <SupplementsPanel />
        </div>

        {/* Desktop layout (lg and above: 1024px+) - current layout */}
        <div className="hidden lg:flex flex-row gap-4">
          <MetricsPanel />
          <div className="w-full gap-4 flex flex-col">
            <SupplementsPanel />
            <div className="rounded-md h-1/2 flex justify-center items-center w-full w-max-lg grid grid-cols-2 gap-4">
              <DashboardButtonLarge
                label="Check-ins"
                header="Check-ins not enabled for your account."
                subheader="If you believe this is an error, please contact support."
              />
              <DashboardButtonLarge
                label="Training"
                header="Training not enabled for your account."
                subheader="If you believe this is an error, please contact support."
              />
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default connector(Dashboard);
