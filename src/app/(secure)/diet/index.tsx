"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducer";
import { Skeleton } from "@/components/ui";
import { getDietLogs } from "./state/actions";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DateTime } from "luxon";

function mapStateToProps(state: RootState) {
  return {
    dietLogs: state.diet.dietLogs,
    dietLogsLoading: state.diet.dietLogsLoading,
  };
}

const connector = connect(mapStateToProps, { getDietLogs });
type PropsFromRedux = ConnectedProps<typeof connector>;

const DietDashboard: React.FC<PropsFromRedux> = ({
  dietLogs,
  dietLogsLoading,
  getDietLogs,
}) => {
  React.useEffect(() => {
    if (!dietLogs && !dietLogsLoading) getDietLogs();
  }, [dietLogs, dietLogsLoading, getDietLogs]);

  const sortedLogs = React.useMemo(() => {
    return (
      dietLogs?.slice().sort((a, b) => {
        return (
          new Date(b.effectiveDate).getTime() -
          new Date(a.effectiveDate).getTime()
        );
      }) || []
    );
  }, [dietLogs]);

  if (dietLogsLoading) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-[170px] w-full rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 w-full">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-[300px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  } else
    return (
      <Card className="w-full rounded-sm dark:bg-[#060B1C] p-0">
        <CardContent>
          <Table>
            <TableBody>
              {sortedLogs?.map((log, index) => (
                <TableRow key={log.id} className="mx-4">
                  <TableCell>
                    {DateTime.fromISO(log.effectiveDate).toFormat(
                      "LLL d, yyyy"
                    )}
                    {index === 0 && (
                      <Badge variant="secondary" className="ml-2">
                        Current
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <code>{Math.floor(log.calories)} cal</code>
                  </TableCell>
                  <TableCell>
                    <code>
                      {Math.floor(log.protein)}p | {Math.floor(log.carbs)}c |{" "}
                      {Math.floor(log.fat)}f
                    </code>
                  </TableCell>
                  {/* <TableCell>
                    <code>{Math.floor(log.water)}oz</code>
                  </TableCell>
                  <TableCell>
                    <code>{Math.floor(log.steps)} steps</code>
                  </TableCell> */}
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`
    ${log.phase === "Maintenance" ? "text-indigo-500 border-indigo-500" : ""}
    ${log.phase === "Bulk" ? "text-violet-500 border-violet-500" : ""}
    ${log.phase === "Cut" ? "text-cyan-500 border-cyan-500" : ""}
  `}
                    >
                      {log.phase}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="text-sm font-medium">
                      Cardio: {log.cardioMinutes}m
                    </div>
                    <div className="text-xs text-muted-foreground truncate w-[200px]">
                      {log.cardio}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm truncate overflow-hidden max-w-[200px]">
                    {log.notes}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
};

export default connector(DietDashboard);
