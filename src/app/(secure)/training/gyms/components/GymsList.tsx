"use client";
import React from "react";
import { Gym } from "../../state/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface GymsListProps {
  gyms: Gym[];
  onGymClick?: (gym: Gym) => void;
  className?: string;
}

const GymsList: React.FC<GymsListProps> = ({
  gyms,
  onGymClick,
  className = "w-full h-96 border rounded-lg overflow-hidden",
}) => {
  return (
    <div className={className}>
      <div className="h-full overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead className="w-[200px]">Gym Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="w-[100px]">Cost</TableHead>
              <TableHead className="w-[120px]">Day Passes</TableHead>
              <TableHead className="w-[150px]">Tags</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gyms.map((gym) => (
              <TableRow
                key={gym.id}
                className="cursor-pointer hover:bg-accent"
                onClick={() => onGymClick?.(gym)}
              >
                <TableCell className="font-medium">{gym.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {gym.city}, {gym.state}
                </TableCell>
                <TableCell>
                  <span className="text-lg">
                    {gym.cost === 1 && "$"}
                    {gym.cost === 2 && "$$"}
                    {gym.cost === 3 && "$$$"}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      gym.dayPasses === true
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : gym.dayPasses === false
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }`}
                  >
                    {gym.dayPasses === true
                      ? "Available"
                      : gym.dayPasses === false
                      ? "Not Available"
                      : "Unknown"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {gym.tags?.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {gym.tags && gym.tags.length > 2 && (
                      <span className="text-xs text-muted-foreground">
                        +{gym.tags.length - 2}
                      </span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default GymsList;
