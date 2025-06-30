"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../store/reducer";
import { getCheckIns, editCheckIn } from "../state/actions";
import { getDietLogs } from "../../diet/state/actions";
import { useParams } from "next/navigation";
import CheckInFormLoadingPage from "../new/components/CheckInFormLoadingPage";
import ViewCheckIn from "./components/ViewCheckIn";
import CheckInForm from "../new/components/CheckInForm";

function mapStateToProps(state: RootState) {
  return {
    checkIns: state.checkins.checkIns,
    checkInsLoading: state.checkins.checkInsLoading,
    deleteCheckInLoading: state.checkins.deleteCheckInLoading,
    editCheckInLoading: state.checkins.editCheckInLoading,
    dietLogs: state.diet.dietLogs,
    dietLogsLoading: state.diet.dietLogsLoading,
  };
}

const connector = connect(mapStateToProps, {
  getCheckIns,
  getDietLogs,
  editCheckIn,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const CheckIn: React.FC<PropsFromRedux> = ({
  checkIns,
  checkInsLoading,
  getCheckIns,
  deleteCheckInLoading,
  dietLogs,
  dietLogsLoading,
  getDietLogs,
  editCheckIn,
  editCheckInLoading,
}) => {
  const [editCheck, setEditCheck] = React.useState<boolean>(false);
  const params = useParams();
  const checkInId = parseInt(params.id as string);

  React.useEffect(() => {
    if (!checkIns && !checkInsLoading) getCheckIns();
  }, [checkIns, checkInsLoading, getCheckIns]);

  React.useEffect(() => {
    if (!dietLogs && !dietLogsLoading) getDietLogs();
  }, [dietLogs, dietLogsLoading, getDietLogs]);

  const checkIn = React.useMemo(() => {
    return checkIns?.find((c) => c.id === checkInId);
  }, [checkIns, checkInId]);

  if (checkInsLoading || dietLogsLoading || deleteCheckInLoading) {
    return <CheckInFormLoadingPage />;
  } else if (editCheck) {
    return (
      <CheckInForm
        onSubmit={(data, files) => {
          const formattedCheckIn = {
            ...data,
            id: checkInId,
          };
          editCheckIn(formattedCheckIn, files)
            .then(() => {
              setEditCheck(false);
            })
            .catch((error) => {
              console.error("Error updating check-in:", error);
            });
        }}
        checkIn={checkIn}
        setEditCheckIn={setEditCheck}
        dietLogs={dietLogs || []}
      />
    );
  } else
    return (
      <ViewCheckIn
        checkIn={checkIn}
        setEditCheckIn={setEditCheck}
        editCheckInLoading={editCheckInLoading}
      />
    );
};

export default connector(CheckIn);
