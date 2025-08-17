"use client";
import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Search, Dumbbell } from "lucide-react";

interface Exercise {
  id: number;
  name: string;
  category: string;
  muscleGroup: string;
}

interface ExerciseSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
}

const defaultExercises: Exercise[] = [
  // Chest
  { id: 1, name: "Bench Press", category: "Chest", muscleGroup: "Pectorals" },
  {
    id: 2,
    name: "Incline Dumbbell Press",
    category: "Chest",
    muscleGroup: "Pectorals",
  },
  { id: 3, name: "Push-ups", category: "Chest", muscleGroup: "Pectorals" },
  { id: 4, name: "Chest Flyes", category: "Chest", muscleGroup: "Pectorals" },

  // Back
  {
    id: 5,
    name: "Pull-ups",
    category: "Back",
    muscleGroup: "Latissimus Dorsi",
  },
  {
    id: 6,
    name: "Deadlift",
    category: "Back",
    muscleGroup: "Latissimus Dorsi",
  },
  { id: 7, name: "Bent-over Row", category: "Back", muscleGroup: "Rhomboids" },
  {
    id: 8,
    name: "Lat Pulldown",
    category: "Back",
    muscleGroup: "Latissimus Dorsi",
  },

  // Shoulders
  {
    id: 9,
    name: "Overhead Press",
    category: "Shoulders",
    muscleGroup: "Deltoids",
  },
  {
    id: 10,
    name: "Lateral Raises",
    category: "Shoulders",
    muscleGroup: "Deltoids",
  },
  {
    id: 11,
    name: "Front Raises",
    category: "Shoulders",
    muscleGroup: "Deltoids",
  },
  {
    id: 12,
    name: "Rear Delt Flyes",
    category: "Shoulders",
    muscleGroup: "Deltoids",
  },

  // Arms
  { id: 13, name: "Bicep Curls", category: "Arms", muscleGroup: "Biceps" },
  { id: 14, name: "Tricep Dips", category: "Arms", muscleGroup: "Triceps" },
  { id: 15, name: "Hammer Curls", category: "Arms", muscleGroup: "Biceps" },
  {
    id: 16,
    name: "Tricep Extensions",
    category: "Arms",
    muscleGroup: "Triceps",
  },

  // Legs
  { id: 17, name: "Squats", category: "Legs", muscleGroup: "Quadriceps" },
  { id: 18, name: "Lunges", category: "Legs", muscleGroup: "Quadriceps" },
  { id: 19, name: "Leg Press", category: "Legs", muscleGroup: "Quadriceps" },
  { id: 20, name: "Calf Raises", category: "Legs", muscleGroup: "Calves" },
  {
    id: 21,
    name: "Romanian Deadlift",
    category: "Legs",
    muscleGroup: "Hamstrings",
  },
  { id: 22, name: "Leg Curls", category: "Legs", muscleGroup: "Hamstrings" },

  // Core
  { id: 23, name: "Plank", category: "Core", muscleGroup: "Abdominals" },
  { id: 24, name: "Crunches", category: "Core", muscleGroup: "Abdominals" },
  { id: 25, name: "Russian Twists", category: "Core", muscleGroup: "Obliques" },
  {
    id: 26,
    name: "Mountain Climbers",
    category: "Core",
    muscleGroup: "Abdominals",
  },
];

const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  isOpen,
  onClose,
  onSelectExercise,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredExercises = defaultExercises.filter(
    (exercise) =>
      exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exercise.muscleGroup.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exercisesByCategory = filteredExercises.reduce((acc, exercise) => {
    if (!acc[exercise.category]) {
      acc[exercise.category] = [];
    }
    acc[exercise.category].push(exercise);
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
            {Object.entries(exercisesByCategory).map(
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
                        <Dumbbell className="w-5 h-5 text-blue-500 mr-3" />
                        <div className="flex-1">
                          <p className="font-medium">{exercise.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {exercise.muscleGroup}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}

            {filteredExercises.length === 0 && (
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

export default ExerciseSelector;
