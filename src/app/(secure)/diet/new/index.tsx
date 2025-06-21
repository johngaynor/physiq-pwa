"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../store/reducer";
import { getDietLogs } from "../state/actions";
import { getSupplements } from "../../health/state/actions";
import DietFormLoadingPage from "./components/DietFormLoadingPage";
import DietLogForm from "./components/DietLogForm";

function mapStateToProps(state: RootState) {
  return {
    dietLogs: state.diet.dietLogs,
    dietLogsLoading: state.diet.dietLogsLoading,
    supplements: state.health.supplements,
    supplementsLoading: state.health.supplementsLoading,
  };
}

const connector = connect(mapStateToProps, { getDietLogs, getSupplements });
type PropsFromRedux = ConnectedProps<typeof connector>;

const DietLogFormWrapper: React.FC<PropsFromRedux> = ({
  dietLogs,
  dietLogsLoading,
  getDietLogs,
  supplements,
  supplementsLoading,
  getSupplements,
}) => {
  React.useEffect(() => {
    if (!dietLogs && !dietLogsLoading) getDietLogs();
    if (!supplements && !supplementsLoading) getSupplements();
  }, [
    dietLogs,
    dietLogsLoading,
    getDietLogs,
    supplements,
    supplementsLoading,
    getSupplements,
  ]);

  const sortedLogs = React.useMemo(() => {
    return (
      dietLogs?.slice().sort((a, b) => {
        return (
          new Date(b.effectiveDate).getTime() -
          new Date(a.effectiveDate).getTime()
        );
      }) || []
    );
  }, [dietLogs]);
  const latestLog = sortedLogs[0];

  function onSubmit(values: any) {
    console.log("submitting", values);
  }

  if (dietLogsLoading || supplementsLoading) {
    return <DietFormLoadingPage />;
  } else
    return (
      <DietLogForm
        supplements={supplements || []}
        latestLog={latestLog}
        onSubmit={onSubmit}
      />
    );
};

export default connector(DietLogFormWrapper);
