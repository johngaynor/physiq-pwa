"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../store/reducer";
import { Input, Button } from "@/components/ui";
import { getDietLogs } from "./state/actions";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DateTime } from "luxon";
import { Plus } from "lucide-react";
import DashboardLoadingPage from "./components/DashboardLoadingPage";
import { useRouter } from "next/navigation";

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
  const [search, setSearch] = React.useState("");
  React.useEffect(() => {
    if (!dietLogs && !dietLogsLoading) getDietLogs();
  }, [dietLogs, dietLogsLoading, getDietLogs]);

  const router = useRouter();

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

  const filteredLogs = React.useMemo(() => {
    if (!search) return sortedLogs;
    return sortedLogs.filter(
      (log) =>
        log.phase?.toLowerCase().includes(search.toLowerCase()) ||
        log.cardio?.toLowerCase().includes(search.toLowerCase()) ||
        log.notes?.toLowerCase().includes(search.toLowerCase()) ||
        log.effectiveDate.includes(search)
    );
  }, [sortedLogs, search]);

  if (dietLogsLoading) {
    return <DashboardLoadingPage />;
  } else
    return (
      <div className="w-full">
        <div className="mb-2 flex flex-row">
          <Input
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search diet logs..."
            className="col-span-3"
            type="text"
          />
          <Button
            className="ml-2"
            variant="outline"
            onClick={() => router.push("/diet/new")}
          >
            <div className="flex">
              <Plus className=" font-extrabold" />
            </div>
          </Button>
        </div>
        <Card className="w-full rounded-sm p-0">
          <CardContent className="p-0">
            <Table>
              <TableBody>
                {filteredLogs?.map((log, index) => (
                  <TableRow
                    key={log.id}
                    onClick={() => router.push(`/diet/log/${log.id}`)}
                    className="cursor-pointer"
                  >
                    <TableCell className="pl-8">
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
                    <TableCell className="text-sm truncate overflow-hidden max-w-[200px] pr-8">
                      {log.notes}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredLogs?.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-gray-500"
                    >
                      {search
                        ? "No diet logs found matching your search."
                        : "No diet logs yet. Create your first one!"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
};

export default connector(DietDashboard);
