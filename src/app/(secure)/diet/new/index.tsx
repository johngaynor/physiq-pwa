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
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
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
    setIsSubmitting(true);
    const formattedLog: DietLog = {
      ...data,
      protein: data.protein,
      fat: data.fat,
      carbs: data.carbs,
      water: data.water,
      cardioMinutes: data.cardioMinutes,
      steps: data.steps,
      calories:
        (data.protein || 0) * 4 + (data.carbs || 0) * 4 + (data.fat || 0) * 9,
    };

    editDietLog(formattedLog)
      .then((data) => router.push(`/diet/log/${data.log.id}`))
      .catch((error) => {
        console.error("Error submitting Diet Log:", error);
        setIsSubmitting(false); // Only reset on error
      });
  }

  if (dietLogsLoading || supplementsLoading || editDietLogLoading || isSubmitting) {
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
