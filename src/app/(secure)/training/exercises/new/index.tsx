"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../../store/reducer";
import { editExercise } from "../../state/actions";
import ExerciseForm from "./components/ExerciseForm";
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

type ExerciseFormData = {
  name: string;
  defaultPrimaryUnit?: number | null;
  defaultSecondaryUnit?: number | null;
  tags?: number[];
};

const ExerciseFormWrapper: React.FC<PropsFromRedux> = ({
  exercisesLoading,
  editExercise,
  editExerciseLoading,
}) => {
  const router = useRouter();

  function onSubmit(data: ExerciseFormData) {
    editExercise(
      null,
      data.name,
      data.defaultPrimaryUnit,
      data.defaultSecondaryUnit,
      data.tags
    ).then((data) => router.push(`/training/exercises/exercise/${data.id}`));
  }

  function onCancel() {
    router.push("/training/exercises");
  }
  if (exercisesLoading || editExerciseLoading) return <ExerciseLoadingPage />;
  return <ExerciseForm onSubmit={onSubmit} onCancel={onCancel} />;
};

export default connector(ExerciseFormWrapper);
