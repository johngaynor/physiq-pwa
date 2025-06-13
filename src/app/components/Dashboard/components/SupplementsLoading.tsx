import React from "react";
import { Skeleton } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SupplementsLoading() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>
            <Skeleton className="h-5 w-30" />
          </TableHead>
          <TableHead className="hidden lg:table-cell truncate overflow-hidden">
            <Skeleton className="h-5 w-30" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-5 w-25" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 6 }).map((_, index) => (
          <TableRow key={"supp-loading-" + index}>
            <TableCell>
              <Skeleton className="h-5 w-5" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-30" />
            </TableCell>
            <TableCell className="hidden lg:table-cell truncate overflow-hidden max-w-[200px]">
              <Skeleton className="h-5 w-30" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-5 w-25" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
