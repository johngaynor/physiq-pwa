"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../../store/reducer";
import { getDietLogs } from "../../state/actions";
import { getDailyLogs } from "@/app/(secure)/health/state/actions";
import { useParams } from "next/navigation";
import LogLoadingPage from "../../components/LogLoadingPage";
import ViewDietLog from "./components/ViewDietLog";
// import DietLogForm from "../../new/components/DietLogForm";

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
  const [editLog, setEditLog] = React.useState<boolean>(false);
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

  if (dietLogsLoading || dailyLogsLoading || deleteDietLogLoading) {
    return <LogLoadingPage />;
  } else if (editLog && log) {
    // return <DietLogForm />;
    return <h1>edit</h1>;
  }
  {
    return <ViewDietLog setEditLog={setEditLog} />;
  }
};

export default connector(DietLog);
