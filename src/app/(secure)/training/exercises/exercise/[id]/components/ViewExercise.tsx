"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { useRouter, useParams } from "next/navigation";
import { RootState } from "@/app/store/reducer";
import { H3, Button } from "@/components/ui";
import {
  Edit,
  Trash,
  List,
  MoreVertical,
  Target,
  Dumbbell,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ConfirmDeleteModal from "@/app/(secure)/components/Modals/ConfirmDeleteModal";
import {
  getExercises,
  deleteExercise,
} from "@/app/(secure)/training/state/actions";

function mapStateToProps(state: RootState) {
  return {
    exercises: state.training.exercises,
    exercisesLoading: state.training.exercisesLoading,
    user: state.app.user,
  };
}

const connector = connect(mapStateToProps, {
  getExercises,
  deleteExercise,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const ViewExercise: React.FC<PropsFromRedux> = ({
  exercises,
  exercisesLoading,
  getExercises,
  deleteExercise,
  user,
}) => {
  const params = useParams();
  const router = useRouter();

  const exerciseId = params.id ? parseInt(params.id as string) : null;

  const exercise = React.useMemo(() => {
    return exercises?.find((e) => e.id === exerciseId);
  }, [exercises, exerciseId]);

  React.useEffect(() => {
    if (!exercises && !exercisesLoading) {
      getExercises();
    }
  }, [exercises, exercisesLoading, getExercises]);

  if (exercisesLoading) {
    return (
      <div className="w-full">
        <Card className="w-full rounded-sm p-0">
          <CardContent className="p-4">
            <p>Loading exercise...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="w-full">
        <Card className="w-full rounded-sm p-0">
          <CardContent className="p-4">
            <p>
              There was no exercise found with this ID. If you think this was a
              mistake, please contact your coach.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isAdmin = user && user.apps.some((app) => app.id === 1);

  return (
    <TooltipProvider>
      <div className="w-full">
        <Card className="w-full rounded-sm p-0">
          <CardContent className="p-4">
            <div className="mb-6 flex justify-between items-center">
              <H3>{exercise.name}</H3>
              {/* Desktop buttons - show on md and larger screens */}
              <div className="hidden md:flex">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => router.push("/training/exercises")}
                    >
                      <List className="font-extrabold" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Go to all exercises</p>
                  </TooltipContent>
                </Tooltip>
                {isAdmin && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="ml-2"
                        variant="outline"
                        onClick={() =>
                          router.push(`/training/exercises/edit/${exercise.id}`)
                        }
                      >
                        <Edit className="font-extrabold" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit exercise</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {isAdmin && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <ConfirmDeleteModal
                        trigger={
                          <Button className="ml-2" variant="outline">
                            <Trash className="font-extrabold" />
                          </Button>
                        }
                        onConfirm={() => {
                          if (exercise.id) {
                            deleteExercise(exercise.id);
                            router.push("/training/exercises");
                          }
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete exercise</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>

              {/* Mobile popover - show on smaller screens */}
              <div className="md:hidden">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      <MoreVertical className="h-4 w-4 mr-2" />
                      Actions
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48" align="end">
                    <div className="flex flex-col space-y-2">
                      <Button
                        variant="ghost"
                        className="justify-start"
                        onClick={() => router.push("/training/exercises")}
                      >
                        <List className="h-4 w-4 mr-2" />
                        Go to all exercises
                      </Button>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          className="justify-start w-full"
                          onClick={() =>
                            router.push(
                              `/training/exercises/edit/${exercise.id}`
                            )
                          }
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit exercise
                        </Button>
                      )}
                      {isAdmin && (
                        <ConfirmDeleteModal
                          trigger={
                            <Button
                              variant="ghost"
                              className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Delete exercise
                            </Button>
                          }
                          onConfirm={() => {
                            if (exercise.id) {
                              deleteExercise(exercise.id);
                              router.push("/training/exercises");
                            }
                          }}
                        />
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Exercise Details */}
              <div className="space-y-6">
                {/* Exercise Type Icon */}
                <div className="flex items-center justify-center p-8 bg-muted rounded-lg">
                  <Dumbbell className="h-16 w-16 text-primary" />
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <p className="text-muted-foreground mb-2">Exercise Name</p>
                    <p className="text-lg font-semibold">{exercise.name}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground mb-2">Primary Unit</p>
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {exercise.primaryUnitType || "Not specified"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-2">
                        Secondary Unit
                      </p>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      >
                        {exercise.secondaryUnitType || "Not specified"}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground mb-2">
                        Default Primary Unit
                      </p>
                      <p className="font-medium">
                        {exercise.defaultPrimaryUnit || "Not set"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-2">
                        Default Secondary Unit
                      </p>
                      <p className="font-medium">
                        {exercise.defaultSecondaryUnit || "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Target Muscles */}
              <div className="space-y-6">
                <div className="flex items-center justify-center p-8 bg-muted rounded-lg">
                  <Target className="h-16 w-16 text-primary" />
                </div>

                <div>
                  <p className="text-muted-foreground mb-4">
                    Target Muscle Groups
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exercise.targets && exercise.targets.length > 0 ? (
                      exercise.targets.map((target, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                        >
                          {target}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground italic">
                        No target muscle groups specified
                      </p>
                    )}
                  </div>
                </div>

                {/* Exercise Statistics */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Exercise Information</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Exercise ID
                      </p>
                      <p className="text-lg font-bold text-primary">
                        #{exercise.id}
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Muscle Groups Targeted
                      </p>
                      <p className="text-lg font-bold text-primary">
                        {exercise.targets?.length || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default connector(ViewExercise);
