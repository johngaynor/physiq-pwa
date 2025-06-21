"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../store/reducer";
import { editDietLog, getDietLogs } from "../state/actions";
import { getSupplements } from "../../health/state/actions";
import DietFormLoadingPage from "./components/DietFormLoadingPage";
import DietLogForm from "./components/DietLogForm";
import { DietLogFormData } from "./types";
import { DietLog } from "../state/types";
import { useRouter } from "next/navigation";

function mapStateToProps(state: RootState) {
  return {
    dietLogs: state.diet.dietLogs,
    dietLogsLoading: state.diet.dietLogsLoading,
    supplements: state.health.supplements,
    supplementsLoading: state.health.supplementsLoading,
    editDietLogLoading: state.diet.editDietLogLoading,
  };
}

const connector = connect(mapStateToProps, {
  getDietLogs,
  getSupplements,
  editDietLog,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const DietLogFormWrapper: React.FC<PropsFromRedux> = ({
  dietLogs,
  dietLogsLoading,
  getDietLogs,
  supplements,
  supplementsLoading,
  getSupplements,
  editDietLogLoading,
  editDietLog,
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

  const router = useRouter();

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

  function onSubmit(data: DietLogFormData) {
    const formattedLog: DietLog = {
      ...data,
      protein: parseFloat(data.protein),
      fat: parseFloat(data.fat),
      carbs: parseFloat(data.carbs),
      water: parseFloat(data.water),
      cardioMinutes: parseFloat(data.cardioMinutes),
      steps: parseFloat(data.steps),
      calories:
        (parseFloat(data.protein) || 0) * 4 +
        (parseFloat(data.carbs) || 0) * 4 +
        (parseFloat(data.fat) || 0) * 9,
    };

    editDietLog(formattedLog).then((data) =>
      router.push(`/diet/log/${data.log.id}`)
    );
  }

  if (dietLogsLoading || supplementsLoading || editDietLogLoading) {
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
