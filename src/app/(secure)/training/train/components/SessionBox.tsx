"use client";
import React from "react";
import { Button, Input } from "@/components/ui";
import { Plus, Ellipsis, Trash2, Edit, Calendar } from "lucide-react";
import { TrainingSession, sessionsAPI } from "../../localDB";
import ExerciseSelector from "./ExerciseSelector";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";

interface SessionBoxProps {
  session: TrainingSession;
  onSessionUpdate?: () => void;
}

const SessionBox: React.FC<SessionBoxProps> = ({
  session,
  onSessionUpdate,
}) => {
  const { name } = session;
  const [isRenaming, setIsRenaming] = React.useState(false);
  const [newName, setNewName] = React.useState(name);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isMoving, setIsMoving] = React.useState(false);
  const [newDate, setNewDate] = React.useState(session.date);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [exerciseSelectorOpen, setExerciseSelectorOpen] = React.useState(false);

  const handleRename = async () => {
    if (!session.id || !newName.trim() || newName.trim() === name) {
      setIsRenaming(false);
      setNewName(name);
      return;
    }

    try {
      setIsUpdating(true);
      await sessionsAPI.update(session.id, { name: newName.trim() });
      setIsRenaming(false);
      setDrawerOpen(false); // Close the drawer after successful rename

      // Call the callback to refresh sessions in parent component
      if (onSessionUpdate) {
        onSessionUpdate();
      }
    } catch (error) {
      console.error("Error renaming session:", error);
      setNewName(name); // Reset to original name on error
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelRename = () => {
    setIsRenaming(false);
    setNewName(name);
  };

  const handleDelete = async () => {
    if (!session.id) {
      console.error("No session ID found");
      return;
    }

    try {
      setIsDeleting(true);
      await sessionsAPI.delete(session.id);
      setDrawerOpen(false); // Close the drawer after successful delete

      // Call the callback to refresh sessions in parent component
      if (onSessionUpdate) {
        onSessionUpdate();
      }
    } catch (error) {
      console.error("Error deleting session:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMove = async () => {
    if (!session.id || !newDate || newDate === session.date) {
      setIsMoving(false);
      setNewDate(session.date);
      return;
    }

    try {
      setIsUpdating(true);
      await sessionsAPI.update(session.id, { date: newDate });
      setIsMoving(false);
      setDrawerOpen(false); // Close the drawer after successful move

      // Call the callback to refresh sessions in parent component
      if (onSessionUpdate) {
        onSessionUpdate();
      }
    } catch (error) {
      console.error("Error moving session:", error);
      setNewDate(session.date); // Reset to original date on error
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelMove = () => {
    setIsMoving(false);
    setNewDate(session.date);
  };

  const handleExerciseSelect = (exercise: any) => {
    console.log("Selected exercise:", exercise);
    // TODO: Add the exercise to the session
    // You can implement the logic to add the exercise to the session here
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setIsRenaming(false);
    setNewName(name);
    setIsMoving(false);
    setNewDate(session.date);
  };
  return (
    <div className="flex flex-col pb-10 px-6">
      <div className="flex items-center justify-between py-6">
        <div className="flex items-center">
          <div className="w-10 h-10 border-2 rounded-full"></div>
          <div className="text-center">
            <h2 className="text-xl text-white ml-4 border-b-2 border-white">
              {name}
            </h2>
          </div>
        </div>
        <Drawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          onClose={handleDrawerClose}
        >
          <DrawerTrigger asChild>
            <Button
              className="rounded-full h-10 w-10 flex items-center justify-center"
              variant="outline"
            >
              <Ellipsis />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="pb-10">
            <DrawerHeader>
              <DrawerTitle>Session Options</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-4 space-y-3">
              {/* Rename Session Option */}
              {!isRenaming ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start h-12 text-left"
                  onClick={() => setIsRenaming(true)}
                >
                  <Edit className="w-4 h-4 mr-3" />
                  Rename Session
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="px-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Session Name
                    </label>
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Enter session name"
                      className="mt-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleRename();
                        } else if (e.key === "Escape") {
                          handleCancelRename();
                        }
                      }}
                      autoFocus
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleRename}
                      disabled={isUpdating || !newName.trim()}
                      className="flex-1"
                    >
                      {isUpdating ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancelRename}
                      disabled={isUpdating}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Move Session Option */}
              {!isMoving ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start h-12 text-left"
                  onClick={() => setIsMoving(true)}
                >
                  <Calendar className="w-4 h-4 mr-3" />
                  Move to Another Day
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="px-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      New Date
                    </label>
                    <Input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="mt-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleMove();
                        } else if (e.key === "Escape") {
                          handleCancelMove();
                        }
                      }}
                      autoFocus
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleMove}
                      disabled={isUpdating || !newDate}
                      className="flex-1"
                    >
                      {isUpdating ? "Moving..." : "Move"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancelMove}
                      disabled={isUpdating}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Delete Session Option */}
              <Button
                variant="ghost"
                className="w-full justify-start h-12 text-left text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleDelete}
                disabled={isDeleting || isUpdating}
              >
                <Trash2 className="w-4 h-4 mr-3" />
                {isDeleting ? "Deleting..." : "Delete Session"}
              </Button>

              {/* Cancel Button */}
              <DrawerClose asChild>
                <Button variant="outline" className="w-full mt-4">
                  Cancel
                </Button>
              </DrawerClose>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
      <div className="mb-8">
        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 text-lg h-12 rounded-md">
          Start Session
        </Button>
      </div>
      <div className="flex justify-between">
        <div className="flex items-center space-x-4">
          <Button
            className="rounded-full h-10 w-10 flex items-center justify-center"
            variant="outline"
            onClick={() => setExerciseSelectorOpen(true)}
          >
            <Plus />
          </Button>
          <span className="text-lg">Add Exercise</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            className="rounded-full h-10 w-10 flex items-center justify-center"
            variant="outline"
          >
            <Plus />
          </Button>
          <span className="text-lg">Add Comments</span>
        </div>
      </div>

      <ExerciseSelector
        isOpen={exerciseSelectorOpen}
        onClose={() => setExerciseSelectorOpen(false)}
        onSelectExercise={handleExerciseSelect}
      />
    </div>
  );
};

export default SessionBox;
