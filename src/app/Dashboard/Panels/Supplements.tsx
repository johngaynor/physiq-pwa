"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducer";
import { Checkbox, Spinner } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toggleSupplementLog } from "../../Health/state/actions";
import { DateTime } from "luxon";

function mapStateToProps(state: RootState) {
  return {
    supplements: state.health.supplements,
    supplementsLoading: state.health.supplementsLoading,
    supplementLogs: state.health.supplementLogs,
    supplementLogsLoading: state.health.supplementLogsLoading,
    dietSupplements: state.health.dietSupplements,
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
    <div className="w-full">
      <div className="border-2 p-2 rounded-md min-h-[100px] flex justify-center items-center mb-20 w-full w-max-lg">
        {!supplements ||
        !supplementLogs ||
        supplementsLoading ||
        supplementLogsLoading ? (
          <Spinner size="large" />
        ) : (
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
                          (l) => l.date === today && l.supplementId === supp.id
                        )?.completed
                      )}
                      onCheckedChange={(checked) =>
                        toggleSupplementLog(today, supp.id, Boolean(checked))
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
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default connector(Metrics);
