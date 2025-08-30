"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../../store/reducer";
import { editExercise } from "../../state/actions";
import ExerciseForm from "./components/ExerciseForm";
import { useRouter } from "next/navigation";

function mapStateToProps(state: RootState) {
  return {
    exercisesLoading: state.training.exercisesLoading,
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
}) => {
  const router = useRouter();

  function onSubmit(data: ExerciseFormData) {
    editExercise(
      null,
      data.name,
      data.defaultPrimaryUnit,
      data.defaultSecondaryUnit
    );

    // TODO: Submit tags when API supports them
    if (data.tags && data.tags.length > 0) {
      console.log("Selected muscle group tags:", data.tags);
    }

    router.push("/training/exercises");
  }

  function onCancel() {
    router.push("/training/exercises");
  }

  return <ExerciseForm onSubmit={onSubmit} onCancel={onCancel} />;
};

export default connector(ExerciseFormWrapper);
