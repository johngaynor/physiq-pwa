"use client";
import React from "react";
import { Button } from "@/components/ui";
import { Plus, Ellipsis } from "lucide-react";
import { TrainingSession } from "../../localDB";

interface SessionBoxProps {
  session: TrainingSession;
}

const SessionBox: React.FC<SessionBoxProps> = ({ session }) => {
  const { name } = session;
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
        <Button
          className="rounded-full h-10 w-10 flex items-center justify-center"
          variant="outline"
        >
          <Ellipsis />
        </Button>
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
