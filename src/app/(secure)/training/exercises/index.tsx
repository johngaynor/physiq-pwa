"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../store/reducer";
import { getExercises, editExercise, deleteExercise } from "../state/actions";
import { Button, Input, Skeleton } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2, Plus } from "lucide-react";
import { ExerciseForm } from "./components/ExerciseForm";
import type { Exercise } from "../state/types";

function mapStateToProps(state: RootState) {
  return {
    exercises: state.training.exercises,
    exercisesLoading: state.training.exercisesLoading,
  };
}

const connector = connect(mapStateToProps, {
  getExercises,
  editExercise,
  deleteExercise,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const Exercises: React.FC<PropsFromRedux> = ({
  exercises,
  exercisesLoading,
  getExercises,
  editExercise,
  deleteExercise,
}) => {
  const [search, setSearch] = React.useState<string>("");

  React.useEffect(() => {
    if (!exercises && !exercisesLoading) getExercises();
  }, [exercises, exercisesLoading, getExercises]);

  // Filter exercises based on search
  const filteredExercises = React.useMemo(() => {
    if (!exercises) return [];

    if (!search.trim()) return exercises;

    return exercises.filter((exercise) =>
      exercise.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [exercises, search]);

  const handleEdit = (exercise: Exercise) => {
    // This function is no longer needed since we handle edit inline
  };

  const handleDelete = (exerciseId: number) => {
    if (window.confirm("Are you sure you want to delete this exercise?")) {
      deleteExercise(exerciseId);
    }
  };

  const handleSubmitNew = (values: { name: string }) => {
    editExercise(null, values.name);
  };

  const createEditHandler =
    (exercise: Exercise) => (values: { name: string }) => {
      editExercise(exercise.id, values.name);
    };
  return (
    <div className="w-full flex flex-col gap-4 mb-20">
      {/* Search and Add Button */}
      <div className="flex gap-2">
        <Input
          id="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search exercises..."
          className="flex-1"
          type="text"
        />
        <ExerciseForm
          Trigger={
            <Button variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Exercise
            </Button>
          }
          title="Add New Exercise"
          description="Create a new exercise for your training routines."
          initialValues={{ name: "" }}
          onSubmit={handleSubmitNew}
        />
      </div>

      {/* Exercises Table */}
      <Card className="w-full">
        <CardContent className="p-0">
          {exercisesLoading ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Skeleton className="h-5 w-32" />
                  </TableHead>
                  <TableHead className="text-center">
                    <Skeleton className="h-5 w-16" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 8 }).map((_, index) => (
                  <TableRow key={`exercise-loading-${index}`}>
                    <TableCell>
                      <Skeleton className="h-5 w-40" />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : filteredExercises.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Exercise Name</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExercises.map((exercise) => (
                  <TableRow key={exercise.id}>
                    <TableCell className="font-medium">
                      {exercise.name}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <ExerciseForm
                          Trigger={
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit exercise</span>
                            </Button>
                          }
                          title="Edit Exercise"
                          description="Update the exercise name."
                          initialValues={{ name: exercise.name }}
                          onSubmit={createEditHandler(exercise)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(exercise.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete exercise</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>
                {search.trim()
                  ? "No exercises found matching your search."
                  : "No exercises found."}
              </p>
              <p className="text-sm mt-1">
                {search.trim()
                  ? "Try adjusting your search terms."
                  : "Add your first exercise to get started."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default connector(Exercises);
