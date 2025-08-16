"use client";
import React from "react";
import { Button, Input } from "@/components/ui";
import { Plus, Ellipsis, Trash2, Edit, Calendar } from "lucide-react";
import { TrainingSession, sessionsAPI } from "../../localDB";
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

      // Call the callback to refresh sessions in parent component
      if (onSessionUpdate) {
        onSessionUpdate();
      }

      console.log("Session renamed successfully");
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
          onClose={() => {
            setIsRenaming(false);
            setNewName(name);
          }}
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
              <Button
                variant="ghost"
                className="w-full justify-start h-12 text-left"
                onClick={() => {
                  // TODO: Implement move to another day functionality
                  console.log("Move session to another day");
                }}
              >
                <Calendar className="w-4 h-4 mr-3" />
                Move to Another Day
              </Button>

              {/* Delete Session Option */}
              <Button
                variant="ghost"
                className="w-full justify-start h-12 text-left text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => {
                  // TODO: Implement delete functionality
                  console.log("Delete session");
                }}
              >
                <Trash2 className="w-4 h-4 mr-3" />
                Delete Session
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
    </div>
  );
};

export default SessionBox;
