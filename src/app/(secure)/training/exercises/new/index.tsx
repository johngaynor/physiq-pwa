"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../../store/reducer";
import { editExercise } from "../../state/actions";
import ExerciseForm from "./components/ExerciseForm";
import { ExerciseFormData } from "./types";
import { useRouter } from "next/navigation";
import ExerciseLoadingPage from "../components/ExerciseLoadingPage";

function mapStateToProps(state: RootState) {
  return {
    exercisesLoading: state.training.exercisesLoading,
    editExerciseLoading: state.training.editExerciseLoading,
  };
}

const connector = connect(mapStateToProps, {
  editExercise,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const ExerciseFormWrapper: React.FC<PropsFromRedux> = ({
  exercisesLoading,
  editExercise,
  editExerciseLoading,
}) => {
  const router = useRouter();

  function onSubmit(data: ExerciseFormData) {
    editExercise({
      name: data.name,
      defaultPrimaryUnit: data.defaultPrimaryUnit,
      defaultSecondaryUnit: data.defaultSecondaryUnit,
      targets: data.targets,
    }).then((data) => router.push(`/training/exercises/exercise/${data.id}`));
  }

  if (exercisesLoading || editExerciseLoading) return <ExerciseLoadingPage />;
  return <ExerciseForm onSubmit={onSubmit} />;
};

export default connector(ExerciseFormWrapper);
