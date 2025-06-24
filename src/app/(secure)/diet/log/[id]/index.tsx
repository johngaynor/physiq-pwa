"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../../store/reducer";
import { getDietLogs } from "../../state/actions";
import { getDailyLogs } from "@/app/(secure)/health/state/actions";
import { useParams } from "next/navigation";
import LogLoadingPage from "../../components/LogLoadingPage";
import ViewDietLog from "./components/ViewDietLog";

function mapStateToProps(state: RootState) {
  return {
    dietLogs: state.diet.dietLogs,
    dietLogsLoading: state.diet.dietLogsLoading,
    dailyLogs: state.health.dailyLogs,
    dailyLogsLoading: state.health.dailyLogsLoading,
    deleteDietLogLoading: state.diet.deleteDietLogLoading,
  };
}

const connector = connect(mapStateToProps, {
  getDietLogs,
  getDailyLogs,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const DietLog: React.FC<PropsFromRedux> = ({
  dietLogs,
  dietLogsLoading,
  getDietLogs,
  dailyLogs,
  dailyLogsLoading,
  getDailyLogs,
  deleteDietLogLoading,
}) => {
  React.useEffect(() => {
    if (!dietLogs && !dietLogsLoading) getDietLogs();
    if (!dailyLogs && !dailyLogsLoading) getDailyLogs();
  }, [
    dietLogs,
    dietLogsLoading,
    getDietLogs,
    dailyLogs,
    dailyLogsLoading,
    getDailyLogs,
  ]);

  const params = useParams();

  const logId = params.id ? parseInt(params.id as string) : null;

  const log = React.useMemo(() => {
    return dietLogs?.find((log) => log.id === logId);
  }, [dietLogs, logId]); // need this to edit

  console.log(log);

  if (dietLogsLoading || dailyLogsLoading || deleteDietLogLoading) {
    return <LogLoadingPage />;
  } else {
    return <ViewDietLog />;
  }
};

export default connector(DietLog);
