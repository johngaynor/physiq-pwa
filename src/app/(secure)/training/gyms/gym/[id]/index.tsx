"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../../../store/reducer";
import { getGyms, editGym as editGymInformation } from "../../../state/actions";
import { useParams } from "next/navigation";
import ViewGym from "./components/ViewGym";
import GymForm from "../../new/components/GymForm";
import GymLoadingPage from "../../components/GymLoadingPage";

function mapStateToProps(state: RootState) {
  return {
    gyms: state.training.gyms,
    gymsLoading: state.training.gymsLoading,
    editGymLoading: state.training.editGymLoading,
  };
}

const connector = connect(mapStateToProps, {
  getGyms,
  editGymInformation,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const Gym: React.FC<PropsFromRedux> = ({
  gyms,
  gymsLoading,
  getGyms,
  editGymInformation,
  editGymLoading,
}) => {
  const [editGym, setEditGym] = React.useState<boolean>(false);
  const params = useParams();
  const gymId = params.id ? parseInt(params.id as string) : null;

  React.useEffect(() => {
    if (!gyms && !gymsLoading) getGyms();
  }, [gyms, gymsLoading, getGyms]);

  const gym = React.useMemo(() => {
    return gyms?.find((gym) => gym.id === gymId);
  }, [gyms, gymId]);

  if (gymsLoading || editGymLoading) {
    return <GymLoadingPage />;
  } else if (editGym && gym) {
    return (
      <GymForm
        onSubmit={(values) => {
          editGymInformation({ ...values, id: gym.id });
          setEditGym(false);
        }}
        gym={gym}
        setEditGym={setEditGym}
      />
    );
  }

  return <ViewGym setEditGym={setEditGym} />;
};

export default connector(Gym);
