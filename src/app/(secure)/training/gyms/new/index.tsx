"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../../store/reducer";
import { getGyms, editGym } from "../../state/actions";
import GymLoadingPage from "../components/GymLoadingPage";
import GymForm from "./components/GymForm";
import { GymSubmissionData } from "./types";
import { useRouter } from "next/navigation";

function mapStateToProps(state: RootState) {
  return {
    gyms: state.training.gyms,
    gymsLoading: state.training.gymsLoading,
  };
}

const connector = connect(mapStateToProps, {
  getGyms,
  editGym,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const GymFormWrapper: React.FC<PropsFromRedux> = ({
  gyms,
  gymsLoading,
  getGyms,
  editGym,
}) => {
  React.useEffect(() => {
    if (!gyms && !gymsLoading) getGyms();
  }, [gyms, gymsLoading, getGyms]);

  const router = useRouter();

  function onSubmit(data: GymSubmissionData) {
    editGym(data).then((data) => router.push(`/training/gyms/gym/${data.id}`));
  }

  if (gymsLoading) {
    return <GymLoadingPage />;
  } else return <GymForm onSubmit={onSubmit} />;
};

export default connector(GymFormWrapper);
