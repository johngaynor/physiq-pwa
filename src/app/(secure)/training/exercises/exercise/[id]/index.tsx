"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../../../store/reducer";
import {
  getExercises,
  editExercise as editExerciseInformation,
} from "../../../state/actions";
import { useParams } from "next/navigation";
import ViewExercise from "./components/ViewExercise";
import ExerciseForm from "../../new/components/ExerciseForm";
import ExerciseLoadingPage from "../../components/ExerciseLoadingPage";

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
    exercises: state.training.exercises,
    exercisesLoading: state.training.exercisesLoading,
    editExerciseLoading: state.training.editExerciseLoading,
  };
}

const connector = connect(mapStateToProps, {
  getExercises,
  editExerciseInformation,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const Exercise: React.FC<PropsFromRedux> = ({
  exercises,
  exercisesLoading,
  getExercises,
  editExerciseInformation,
  editExerciseLoading,
}) => {
  const [editExercise, setEditExercise] = React.useState<boolean>(false);
  const params = useParams();
  const exerciseId = params.id ? parseInt(params.id as string) : null;

  React.useEffect(() => {
    if (!exercises && !exercisesLoading) getExercises();
  }, [exercises, exercisesLoading, getExercises]);

  const exercise = React.useMemo(() => {
    return exercises?.find((exercise) => exercise.id === exerciseId);
  }, [exercises, exerciseId]);

  if (exercisesLoading || editExerciseLoading) {
    return <ExerciseLoadingPage />;
  } else if (editExercise && exercise) {
    return (
      <ExerciseForm
        onSubmit={(values) => {
          const submissionData = {
            ...values,
            id: exercise.id,
            targets: convertTargetNamesToIds(values.targets || []) as any,
          };
          editExerciseInformation(submissionData);
          setEditExercise(false);
        }}
        exercise={exercise}
        setEditExercise={setEditExercise}
      />
    );
  }

  return <ViewExercise setEditExercise={setEditExercise} />;
};

export default connector(Exercise);
