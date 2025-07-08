"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../../store/reducer";
import {
  getCheckIns,
  editCheckIn,
  getCheckInAttachments,
  getPoses,
  getCheckInComments,
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
    poses: state.checkins.poses,
    posesLoading: state.checkins.posesLoading,
    commentsLoading: state.checkins.commentsLoading,
    commentsId: state.checkins.commentsId,
  };
}

const connector = connect(mapStateToProps, {
  getCheckIns,
  getDietLogs,
  getDailyLogs,
  editCheckIn,
  getCheckInAttachments,
  getPoses,
  getCheckInComments,
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
  poses,
  posesLoading,
  getPoses,
  commentsLoading,
  commentsId,
  getCheckInComments,
}) => {
  const [editCheck, setEditCheck] = React.useState<boolean>(false);
  const params = useParams();
  const checkInId = parseInt(params.id as string);

  React.useEffect(() => {
    if (!checkIns && !checkInsLoading) getCheckIns();
    if (!dietLogs && !dietLogsLoading) getDietLogs();
    if (!dailyLogs && !dailyLogsLoading) getDailyLogs();
    if (!poses && !posesLoading) getPoses();
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
    poses,
    posesLoading,
    getPoses,
  ]);

  // find applicable check-in
  const checkIn = React.useMemo(() => {
    return checkIns?.find((c: any) => c.id === checkInId);
  }, [checkIns, checkInId]);

  React.useEffect(() => {
    if (
      checkInId &&
      checkIn &&
      attachmentsId !== checkInId &&
      !attachmentsLoading
    ) {
      getCheckInAttachments(checkInId);
    }
  }, [
    checkInId,
    checkIn,
    attachmentsId,
    attachmentsLoading,
    getCheckInAttachments,
  ]);

  React.useEffect(() => {
    if (checkInId && checkIn && commentsId !== checkInId && !commentsLoading) {
      getCheckInComments(checkInId);
    }
  }, [checkInId, checkIn, commentsId, commentsLoading, getCheckInComments]);

  // find applicable diet log
  const dietLog = React.useMemo(() => {
    if (!checkIn || !dietLogs || dietLogs.length === 0) return null;

    const checkInDate = checkIn.date;
    const sortedDietLogs = [...dietLogs].sort((a: any, b: any) =>
      b.effectiveDate.localeCompare(a.effectiveDate)
    );
    const applicableLog = sortedDietLogs.find((log: any) => {
      return log.effectiveDate <= checkInDate;
    });

    return applicableLog || null;
  }, [checkIn, dietLogs]);

  if (
    checkInsLoading ||
    dietLogsLoading ||
    dailyLogsLoading ||
    deleteCheckInLoading ||
    editCheckInLoading ||
    attachmentsLoading ||
    posesLoading ||
    commentsLoading
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
        dietLog={dietLog}
      />
    );
};

export default connector(CheckIn);
