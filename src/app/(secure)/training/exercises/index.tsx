"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../store/reducer";
import { getExercises } from "../state/actions";
import { Button, Badge } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import ExerciseFiltersComponent, {
  ExerciseFilters,
  initialExerciseFilters,
} from "./components/ExerciseFilters";

// Hardcoded exercise units - should match the ones in ExerciseForm
const EXERCISE_UNITS = [
  { id: 1, name: "Weight", measurement: "number" },
  { id: 2, name: "Reps", measurement: "number" },
  { id: 3, name: "Time", measurement: "time" },
  { id: 4, name: "BPM", measurement: "number" },
];

// Helper function to get unit name by ID
const getUnitNameById = (unitId: number | null | undefined): string => {
  if (!unitId) return "-";
  const unit = EXERCISE_UNITS.find((u) => u.id === unitId);
  return unit ? unit.name : "-";
};

function mapStateToProps(state: RootState) {
  return {
    exercises: state.training.exercises,
    exercisesLoading: state.training.exercisesLoading,
    user: state.app.user,
  };
}

const connector = connect(mapStateToProps, {
  getExercises,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const Exercises: React.FC<PropsFromRedux> = ({
  exercises,
  exercisesLoading,
  getExercises,
  user,
}) => {
  const [filters, setFilters] = React.useState<ExerciseFilters>(
    initialExerciseFilters
  );
  const router = useRouter();

  React.useEffect(() => {
    if (!exercises && !exercisesLoading) getExercises();
  }, [exercises, exercisesLoading, getExercises]);

  // Filter exercises based on search and targets
  const filteredExercises = React.useMemo(() => {
    if (!exercises) return [];

    return exercises.filter((exercise) => {
      // Text search filter
      const matchesSearch =
        !filters.search.trim() ||
        exercise.name.toLowerCase().includes(filters.search.toLowerCase());

      // Targets filter
      const matchesTargets =
        filters.targets.length === 0 ||
        filters.targets.some((target) => exercise.targets?.includes(target));

      return matchesSearch && matchesTargets;
    });
  }, [exercises, filters]);

  const isAdmin = user && user.apps.some((app) => app.id === 1);

  return (
    <div className="w-full flex flex-col gap-4 mb-20">
      {/* Two Column Layout */}
      <Card className="w-full pt-0">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {/* Left Column - Filters */}
          <div>
            <div className="gap-2 flex justify-between w-full mb-2">
              <h2 className="text-2xl font-bold mb-4">Filter Exercises</h2>
              <Button
                variant="outline"
                onClick={() => {
                  setFilters(initialExerciseFilters);
                }}
              >
                Reset All
              </Button>
            </div>

            <ExerciseFiltersComponent
              filters={filters}
              onFiltersChange={setFilters}
            />

            {/* Quick Stats */}
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">
                    Total Exercises
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {exercisesLoading ? "..." : exercises?.length || 0}
                  </p>
                </div>
                <div className="p-3 border rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Showing</p>
                  <p className="text-2xl font-bold text-primary">
                    {exercisesLoading ? "..." : filteredExercises.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Exercise Table */}
          <div>
            <div className="gap-2 flex justify-end w-full mb-4">
              {isAdmin && (
                <Button
                  variant="outline"
                  onClick={() => router.push("/training/exercises/new")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Exercise
                </Button>
              )}
            </div>

            {/* Exercise Table */}
            <div className="w-full h-[400px] border rounded-lg overflow-hidden">
              <div className="h-full overflow-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Primary Unit</TableHead>
                      <TableHead>Secondary Unit</TableHead>
                      <TableHead>Targets</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exercisesLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          Loading exercises...
                        </TableCell>
                      </TableRow>
                    ) : filteredExercises.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          {filters.search.trim() || filters.targets.length > 0
                            ? "No exercises match your filters"
                            : "No exercises available"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredExercises.map((exercise) => (
                        <TableRow
                          key={exercise.id}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() =>
                            router.push(
                              `/training/exercises/exercise/${exercise.id}`
                            )
                          }
                        >
                          <TableCell className="font-medium">
                            {exercise.name}
                          </TableCell>
                          <TableCell>
                            {getUnitNameById(exercise.defaultPrimaryUnit)}
                          </TableCell>
                          <TableCell>
                            {getUnitNameById(exercise.defaultSecondaryUnit)}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {exercise.targets?.map((target) => (
                                <Badge
                                  key={target}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {target}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default connector(Exercises);
