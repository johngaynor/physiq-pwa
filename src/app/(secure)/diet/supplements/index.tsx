"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../store/reducer";
import { getSupplements } from "../../health/state/actions";
import { Skeleton } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function mapStateToProps(state: RootState) {
  return {
    supplements: state.health.supplements,
    supplementsLoading: state.health.supplementsLoading,
  };
}

const connector = connect(mapStateToProps, {
  getSupplements,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const Supplements: React.FC<PropsFromRedux> = ({
  supplements,
  supplementsLoading,
  getSupplements,
}) => {
  React.useEffect(() => {
    if (!supplementsLoading && !supplements) {
      getSupplements();
    }
  }, [supplementsLoading, supplements, getSupplements]);

  return (
    <div className="w-full flex flex-col gap-4 mb-20">
      <div className="border-2 p-4 rounded-md w-full">
        {supplementsLoading || !supplements ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Skeleton className="h-5 w-32" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-5 w-40" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-5 w-28" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-5 w-20" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 8 }).map((_, index) => (
                <TableRow key={"supplement-loading-" + index}>
                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : supplements && supplements.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Default Dosage</TableHead>
                <TableHead>Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {supplements.map((supplement) => (
                <TableRow key={supplement.id}>
                  <TableCell className="font-medium">
                    {supplement.name}
                  </TableCell>
                  <TableCell className="max-w-md truncate">
                    {supplement.description || "No description"}
                  </TableCell>
                  <TableCell>{supplement.dosage || "Not specified"}</TableCell>
                  <TableCell>{supplement.priority}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <p>No supplements found in the database</p>
            <p className="text-sm mt-1">
              Add supplements to start building your database
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default connector(Supplements);
