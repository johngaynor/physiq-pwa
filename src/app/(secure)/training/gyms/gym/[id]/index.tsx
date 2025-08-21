"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../../../store/reducer";
import { getGyms } from "../../../state/actions";
// import { useParams } from "next/navigation";
// import LogLoadingPage from "../../components/LogLoadingPage";
// import ViewDietLog from "./components/ViewDietLog";
// import DietLogForm from "../../new/components/DietLogForm";
import ViewGym from "./components/ViewGym";

function mapStateToProps(state: RootState) {
  return {
    gyms: state.training.gyms,
    gymsLoading: state.training.gymsLoading,
  };
}

const connector = connect(mapStateToProps, {
  getGyms,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const Gym: React.FC<PropsFromRedux> = ({ gyms, gymsLoading, getGyms }) => {
  React.useEffect(() => {
    if (!gyms && !gymsLoading) getGyms();
  }, [gyms, gymsLoading, getGyms]);

  // const params = useParams();

  // const gymId = params.id ? parseInt(params.id as string) : null;

  // const gym = React.useMemo(() => {
  //   return gyms?.find((gym) => gym.id === gymId);
  // }, [gyms, gymId]);

  if (gymsLoading) {
    return "loading";
  } else {
    return <ViewGym />;
  }
};

export default connector(Gym);
