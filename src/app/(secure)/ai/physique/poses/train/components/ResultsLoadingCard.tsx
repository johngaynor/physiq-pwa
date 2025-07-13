import React from "react";
import { Skeleton } from "@/components/ui";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ResultsLoadingCard() {
  return (
    <Card className="w-full rounded-sm p-0 h-full">
      <CardContent className="p-6 h-full flex flex-col">
        {/* Header Section */}
        <Skeleton className="h-6 w-32 mb-4" />

        <div className="space-y-3 flex-1 flex flex-col">
          {/* Predicted Result Title */}
          <Skeleton className="h-6 w-2/3 mx-auto" />

          {/* Table Container */}
          <div className="w-full rounded-lg border flex-1 flex flex-col">
            {/* Table Header */}
            <Skeleton className="h-5 w-40 m-4 mb-2" />

            {/* Table */}
            <div className="flex-1 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Skeleton className="h-4 w-30" />
                    </TableHead>
                    <TableHead className="flex items-center justify-end">
                      <Skeleton className="h-4 w-28" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="h-4 w-36" />
                      </TableCell>
                      <TableCell className="flex items-center justify-end">
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pose Selection and Clear Button Section */}
          <div className="flex gap-3 items-end mt-4">
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-20 shrink-0" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
