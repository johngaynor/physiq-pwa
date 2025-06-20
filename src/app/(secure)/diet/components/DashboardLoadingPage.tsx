import React from "react";
import { Skeleton } from "@/components/ui";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardLoadingPage() {
  return (
    <Card className="w-full rounded-sm dark:bg-[#060B1C] p-0">
      <CardContent>
        <Table>
          <TableBody>
            {Array.from({ length: 15 }).map((_, index) => (
              <TableRow key={index} className="mx-4">
                <TableCell>
                  <Skeleton className="h-6" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6" />
                </TableCell>

                <TableCell>
                  <div className="text-sm font-medium">
                    <Skeleton className="h-6" />
                  </div>
                </TableCell>
                <TableCell className="text-sm truncate overflow-hidden max-w-[200px]">
                  <Skeleton className="h-6" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
