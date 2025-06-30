"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../store/reducer";
import { editCheckIn } from "../state/actions";
import { getDietLogs } from "../../diet/state/actions";
import CheckInFormLoadingPage from "./components/CheckInFormLoadingPage";
import CheckInForm from "./components/CheckInForm";
import { CheckInFormData } from "./types";
import { CheckIn } from "../state/types";
import { useRouter } from "next/navigation";

function mapStateToProps(state: RootState) {
  return {
    editCheckInLoading: state.checkins.editCheckInLoading,
    dietLogs: state.diet.dietLogs,
    dietLogsLoading: state.diet.dietLogsLoading,
  };
}

const connector = connect(mapStateToProps, {
  editCheckIn,
  getDietLogs,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const CheckInFormWrapper: React.FC<PropsFromRedux> = ({
  editCheckInLoading,
  editCheckIn,
  dietLogs,
  dietLogsLoading,
  getDietLogs,
}) => {
  React.useEffect(() => {
    if (!dietLogs && !dietLogsLoading) getDietLogs();
  }, [dietLogs, dietLogsLoading, getDietLogs]);

  const router = useRouter();

  function onSubmit(data: CheckInFormData, files?: File[]) {
    const formattedCheckIn: CheckIn = {
      ...data,
    };

    editCheckIn(formattedCheckIn, files)
      .then((data) => {
        router.push(`/checkins`);
      })
      .catch((error) => {
        console.error("Error submitting CheckIn:", error);
      });
  }

  if (editCheckInLoading || dietLogsLoading) {
    return <CheckInFormLoadingPage />;
  } else return <CheckInForm onSubmit={onSubmit} dietLogs={dietLogs || []} />;
};

export default connector(CheckInFormWrapper);
