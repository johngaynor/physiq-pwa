"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../../store/reducer";
import {
  getCheckIns,
  editCheckIn,
  getCheckInAttachments,
} from "../../state/actions";
import { getDietLogs } from "../../../diet/state/actions";
import { getDailyLogs } from "../../../health/state/actions";
import { useParams } from "next/navigation";
import CheckInFormLoadingPage from "../../new/components/CheckInFormLoadingPage";
import ViewCheckIn from "./components/ViewCheckIn";
import CheckInForm from "../../new/components/CheckInForm";

function mapStateToProps(state: RootState) {
  return {
    checkIns: state.checkins.checkIns,
    checkInsLoading: state.checkins.checkInsLoading,
    deleteCheckInLoading: state.checkins.deleteCheckInLoading,
    editCheckInLoading: state.checkins.editCheckInLoading,
    dietLogs: state.diet.dietLogs,
    dietLogsLoading: state.diet.dietLogsLoading,
    dailyLogs: state.health.dailyLogs,
    dailyLogsLoading: state.health.dailyLogsLoading,
    attachments: state.checkins.attachments,
    attachmentsLoading: state.checkins.attachmentsLoading,
    attachmentsId: state.checkins.attachmentsId,
  };
}

const connector = connect(mapStateToProps, {
  getCheckIns,
  getDietLogs,
  getDailyLogs,
  editCheckIn,
  getCheckInAttachments,
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
  dailyLogs,
  dailyLogsLoading,
  getDailyLogs,
  editCheckIn,
  editCheckInLoading,
  attachments,
  attachmentsLoading,
  attachmentsId,
  getCheckInAttachments,
}) => {
  const [editCheck, setEditCheck] = React.useState<boolean>(false);
  const params = useParams();
  const checkInId = parseInt(params.id as string);

  React.useEffect(() => {
    if (!checkIns && !checkInsLoading) getCheckIns();
    if (!dietLogs && !dietLogsLoading) getDietLogs();
    if (!dailyLogs && !dailyLogsLoading) getDailyLogs();
  }, [
    checkIns,
    checkInsLoading,
    getCheckIns,
    dietLogs,
    dietLogsLoading,
    getDietLogs,
    dailyLogs,
    dailyLogsLoading,
    getDailyLogs,
  ]);

  React.useEffect(() => {
    if (checkInId && attachmentsId !== checkInId && !attachmentsLoading) {
      getCheckInAttachments(checkInId);
    }
  }, [checkInId, attachmentsId, attachmentsLoading, getCheckInAttachments]);

  const checkIn = React.useMemo(() => {
    return checkIns?.find((c) => c.id === checkInId);
  }, [checkIns, checkInId]);

  if (
    checkInsLoading ||
    dietLogsLoading ||
    dailyLogsLoading ||
    deleteCheckInLoading ||
    editCheckInLoading ||
    attachmentsLoading
  ) {
    return <CheckInFormLoadingPage />;
  } else if (editCheck) {
    return (
      <CheckInForm
        onSubmit={(data: any, files?: File[]) => {
          const formattedCheckIn = {
            ...data,
            id: checkInId,
          };
          editCheckIn(formattedCheckIn, files)
            .then(() => {
              setEditCheck(false);
            })
            .catch((error: any) => {
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
        attachments={attachmentsId === checkInId ? attachments : []}
      />
    );
};

export default connector(CheckIn);
