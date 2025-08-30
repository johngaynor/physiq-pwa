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
          editExerciseInformation({ ...values, id: exercise.id });
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
