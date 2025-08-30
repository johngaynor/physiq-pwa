"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../../store/reducer";
import { editExercise } from "../../state/actions";
import ExerciseForm from "./components/ExerciseForm";
import { ExerciseFormData } from "./types";
import { useRouter } from "next/navigation";
import ExerciseLoadingPage from "../components/ExerciseLoadingPage";

// Hardcoded muscle group targets - should match the ones in ExerciseForm
const MUSCLE_GROUPS = [
  { id: 1, name: "Quads" },
  { id: 2, name: "Calves" },
  { id: 3, name: "Hamstrings" },
  { id: 4, name: "Glutes" },
  { id: 5, name: "Abs" },
  { id: 6, name: "Chest" },
  { id: 7, name: "Rear Delts" },
  { id: 8, name: "Front Delts" },
  { id: 9, name: "Side Delts" },
  { id: 10, name: "Triceps" },
  { id: 11, name: "Biceps" },
  { id: 12, name: "Forearms" },
  { id: 13, name: "Back" },
  { id: 14, name: "Cardio" },
];

// Helper function to convert target names to IDs
const convertTargetNamesToIds = (targetNames: string[]): number[] => {
  return targetNames
    .map((name) => {
      const muscle = MUSCLE_GROUPS.find((m) => m.name === name);
      return muscle ? muscle.id : null;
    })
    .filter((id): id is number => id !== null);
};

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
      targets: convertTargetNamesToIds(data.targets || []) as any,
    }).then((data) => router.push(`/training/exercises/exercise/${data.id}`));
  }

  if (exercisesLoading || editExerciseLoading) return <ExerciseLoadingPage />;
  return <ExerciseForm onSubmit={onSubmit} />;
};

export default connector(ExerciseFormWrapper);
