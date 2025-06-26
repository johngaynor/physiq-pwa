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
import { H1, H5 } from "@/components/ui";
import { CirclePlus } from "lucide-react";
import { DateTime } from "luxon";

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
      <div className="w-full flex flex-col gap-4 mb-20">
        {/* Mobile layout (below md/768px) - everything stacked vertically */}
        <div className="flex flex-col gap-4 md:hidden">
          <MetricsPanel />
          <SupplementsPanel />
          <button
            className="relative h-48 w-full border-2 rounded-md flex justify-center items-center bg-background hover:bg-accent transition"
            onClick={() => {
              const today = DateTime.now().toISODate();
              window.open(
                `https://preprolabs.com/fitness/log/${today}`,
                "_blank"
              );
            }}
          >
            <div className="absolute inset-0">
              <div className="w-full h-full flex flex-col items-center justify-center border rounded-md bg-background hover:bg-accent transition">
                <p className="absolute left-5 top-3 text-gray-500">Training</p>
                {false ? (
                  <>
                    <H1>Training Stats</H1>
                    <H5>Training Stats</H5>
                  </>
                ) : (
                  <>
                    <CirclePlus className="size-12 font-extrabold" />
                    <H5>Add Training</H5>
                  </>
                )}
              </div>
            </div>
          </button>
          <button
            className="relative h-48 w-full border-2 rounded-md flex justify-center items-center bg-background hover:bg-accent transition"
            onClick={() => {
              const today = DateTime.now().toISODate();
              window.open(`https://preprolabs.com/checkins/${today}`, "_blank");
            }}
          >
            <div className="absolute inset-0">
              <div className="w-full h-full flex flex-col items-center justify-center border rounded-md bg-background hover:bg-accent transition">
                <p className="absolute left-5 top-3 text-gray-500">Check-ins</p>
                {true ? (
                  <>
                    <H1>Check-in Stats</H1>
                    <H5>Check-in Stats</H5>
                  </>
                ) : (
                  <>
                    <CirclePlus className="size-12 font-extrabold" />
                    <H5>Add Check-in</H5>
                  </>
                )}
              </div>
            </div>
          </button>
        </div>

        {/* Tablet layout (md to lg: 768px-1023px) - metrics left, his stacked right, supplements bottom */}
        <div className="hidden md:flex lg:hidden flex-col gap-4">
          <div className="flex flex-row gap-4">
            <MetricsPanel />
            <div className="w-full gap-4 flex flex-col">
              <button
                className="relative h-full w-full border-2 rounded-md flex justify-center items-center rounded-md bg-background hover:bg-accent transition"
                onClick={() => {
                  const today = DateTime.now().toISODate();
                  window.open(
                    `https://preprolabs.com/fitness/log/${today}`,
                    "_blank"
                  );
                }}
              >
                <div className="absolute inset-0">
                  <div className="w-full h-full flex flex-col items-center justify-center border rounded-md bg-background hover:bg-accent transition">
                    <p className="absolute left-5 top-3 text-gray-500">
                      Training
                    </p>
                    {true ? (
                      <>
                        <H1>Training Stats</H1>
                        <H5>Training Stats</H5>
                      </>
                    ) : (
                      <>
                        <CirclePlus className="size-12 font-extrabold" />
                        <H5>Add Training</H5>
                      </>
                    )}
                  </div>
                </div>
              </button>
              <button
                className="relative h-full w-full border-2 rounded-md flex justify-center items-center rounded-md bg-background hover:bg-accent transition"
                onClick={() => {
                  const today = DateTime.now().toISODate();
                  window.open(
                    `https://preprolabs.com/checkins/${today}`,
                    "_blank"
                  );
                }}
              >
                <div className="absolute inset-0">
                  <div className="w-full h-full flex flex-col items-center justify-center border rounded-md bg-background hover:bg-accent transition">
                    <p className="absolute left-5 top-3 text-gray-500">
                      Check-ins
                    </p>
                    {false ? (
                      <>
                        <H1>Check-in Stats</H1>
                        <H5>Check-in Stats</H5>
                      </>
                    ) : (
                      <>
                        <CirclePlus className="size-12 font-extrabold" />
                        <H5>Add Check-in</H5>
                      </>
                    )}
                  </div>
                </div>
              </button>
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
              <button
                className="relative h-full w-full border-2 rounded-md flex justify-center items-center rounded-md bg-background hover:bg-accent transition"
                onClick={() => {
                  const today = DateTime.now().toISODate();
                  window.open(
                    `https://preprolabs.com/fitness/log/${today}`,
                    "_blank"
                  );
                }}
              >
                <div className="absolute inset-0">
                  <div className="w-full h-full flex flex-col items-center justify-center border rounded-md bg-background hover:bg-accent transition">
                    <p className="absolute left-5 top-3 text-gray-500">
                      Training
                    </p>
                    {true ? (
                      <>
                        <H1>Training Stats</H1>
                        <H5>Training Stats</H5>
                      </>
                    ) : (
                      <>
                        <CirclePlus className="size-12 font-extrabold" />
                        <H5>Add Training</H5>
                      </>
                    )}
                  </div>
                </div>
              </button>
              <button
                className="relative h-full w-full border-2 rounded-md flex justify-center items-center rounded-md bg-background hover:bg-accent transition"
                onClick={() => {
                  const today = DateTime.now().toISODate();
                  window.open(
                    `https://preprolabs.com/checkins/${today}`,
                    "_blank"
                  );
                }}
              >
                <div className="absolute inset-0">
                  <div className="w-full h-full flex flex-col items-center justify-center border rounded-md bg-background hover:bg-accent transition">
                    <p className="absolute left-5 top-3 text-gray-500">
                      Check-ins
                    </p>
                    {true ? (
                      <>
                        <H1>Check-in Stats</H1>
                        <H5>Check-in Stats</H5>
                      </>
                    ) : (
                      <>
                        <CirclePlus className="size-12 font-extrabold" />
                        <H5>Add Check-in</H5>
                      </>
                    )}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default connector(Dashboard);
