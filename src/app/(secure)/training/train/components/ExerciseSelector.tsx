"use client";
import React, { useState, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../../store/reducer";
import { getExercises } from "../../state/actions";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Search, Dumbbell, Activity } from "lucide-react";
import { Exercise } from "../../state/types";

interface ExerciseSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
}

function mapStateToProps(state: RootState) {
  return {
    exercises: state.training.exercises,
    exercisesLoading: state.training.exercisesLoading,
  };
}

const connector = connect(mapStateToProps, {
  getExercises,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const ExerciseSelector: React.FC<ExerciseSelectorProps & PropsFromRedux> = ({
  isOpen,
  onClose,
  onSelectExercise,
  exercises,
  exercisesLoading,
  getExercises,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch exercises when component mounts
  useEffect(() => {
    if (!exercises) {
      getExercises();
    }
  }, [exercises, getExercises]);

  // Filter exercises based on search term
  const filteredExercises = exercises 
    ? exercises.filter((exercise) =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (exercise.target && exercise.target.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  // Group exercises by target (muscle group)
  const exercisesByCategory = filteredExercises.reduce((acc, exercise) => {
    const category = exercise.target || "General";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(exercise);
    return acc;
  }, {} as Record<string, Exercise[]>);

  const handleExerciseSelect = (exercise: Exercise) => {
    onSelectExercise(exercise);
    onClose();
    setSearchTerm(""); // Reset search when closing
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[90vh] max-h-[90vh]">
        <DrawerHeader className="pb-4">
          <DrawerTitle className="text-xl font-semibold">
            Select Exercise
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 flex flex-col px-4 pb-4 overflow-hidden">
          {/* Search Input */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Exercises List */}
          <div className="flex-1 overflow-y-auto">
            {exercisesLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">
                  Loading exercises...
                </div>
              </div>
            )}

            {!exercisesLoading &&
              Object.entries(exercisesByCategory).map(
                ([category, exercises]) => (
                  <div key={category} className="mb-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-3 sticky top-0 bg-background py-2">
                      {category}
                    </h3>
                    <div className="space-y-2">
                      {exercises.map((exercise) => (
                        <div
                          key={exercise.id}
                          onClick={() => handleExerciseSelect(exercise)}
                          className="flex items-center p-3 bg-card rounded-lg border hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
                        >
                          {exercise.target?.toLowerCase() === 'cardio' ? (
                            <Activity className="w-5 h-5 text-red-500 mr-3" />
                          ) : (
                            <Dumbbell className="w-5 h-5 text-blue-500 mr-3" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{exercise.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {exercise.target || "General"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}

            {!exercisesLoading && filteredExercises.length === 0 && (
              <div className="text-center py-12">
                <Dumbbell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No exercises found</p>
                <p className="text-sm text-gray-400">
                  Try a different search term
                </p>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default connector(ExerciseSelector);
