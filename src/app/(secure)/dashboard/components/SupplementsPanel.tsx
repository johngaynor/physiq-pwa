"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../store/reducer";
import { Checkbox, Skeleton } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toggleSupplementLog } from "../../health/state/actions";
import { DateTime } from "luxon";

function mapStateToProps(state: RootState) {
  return {
    supplements: state.health.supplements,
    supplementsLoading: state.health.supplementsLoading,
    supplementLogs: state.health.supplementLogs,
    supplementLogsLoading: state.health.supplementLogsLoading,
    dietSupplements: state.diet.dietSupplements,
  };
}

const connector = connect(mapStateToProps, {
  toggleSupplementLog,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const Metrics: React.FC<PropsFromRedux> = ({
  supplements,
  supplementsLoading,
  supplementLogs,
  supplementLogsLoading,
  dietSupplements,
  toggleSupplementLog,
}) => {
  const today = DateTime.now().toISODate();

  return (
    <div className="border-2 p-2 rounded-md h-1/2 w-full w-max-lg overflow-hidden">
      <div
        className={`${
          dietSupplements && dietSupplements.length > 6
            ? "overflow-y-auto"
            : "overflow-hidden"
        } h-full`}
      >
        {!supplements ||
        !supplementLogs ||
        supplementsLoading ||
        supplementLogsLoading ? (
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
        ) : dietSupplements && dietSupplements.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Supplement</TableHead>
                <TableHead className="hidden lg:table-cell truncate overflow-hidden">
                  Frequency
                </TableHead>
                <TableHead className="lg:pl-5">Dosage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dietSupplements?.map((supp) => (
                <TableRow key={supp.id}>
                  <TableCell className="font-medium">
                    <Checkbox
                      checked={Boolean(
                        supplementLogs?.find(
                          (l) =>
                            l.date === today &&
                            l.supplementId === supp.supplementId
                        )?.completed
                      )}
                      onCheckedChange={(checked) =>
                        toggleSupplementLog(
                          today,
                          supp.supplementId,
                          Boolean(checked)
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {supplements?.find((s) => s.id === supp.supplementId)?.name}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell truncate overflow-hidden max-w-[200px]">
                    {supp.frequency}
                  </TableCell>
                  <TableCell className="lg:pl-5">{supp.dosage}</TableCell>
                </TableRow>
              ))}
              {Array.from({
                length: Math.max(0, 7 - dietSupplements.length),
              }).map((_, index) => (
                <TableRow key={"supp-empty-" + index} className="h-8">
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="hidden lg:table-cell truncate overflow-hidden"></TableCell>
                  <TableCell className="lg:pl-5"></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <p>No supplements configured</p>
              <p className="text-sm mt-1">
                Add supplements to your diet plan to track them here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default connector(Metrics);
