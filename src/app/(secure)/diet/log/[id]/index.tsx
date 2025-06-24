"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../../store/reducer";
import { getDietLogs, deleteDietLog } from "../../state/actions";
import { getDailyLogs } from "@/app/(secure)/health/state/actions";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { StatisticsGraph } from "@/app/(secure)/health/components/StatisticsGraph";
import { H3, Button } from "@/components/ui";
import { Trash } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { FieldValue } from "../../components/FieldValues";
import { useRouter } from "next/navigation";
import LogLoadingPage from "../../components/LogLoadingPage";

function mapStateToProps(state: RootState) {
  return {
    dietLogs: state.diet.dietLogs,
    dietLogsLoading: state.diet.dietLogsLoading,
    dailyLogs: state.health.dailyLogs,
    dailyLogsLoading: state.health.dailyLogsLoading,
    deleteDietLogLoading: state.diet.deleteDietLogLoading,
  };
}

const connector = connect(mapStateToProps, {
  getDietLogs,
  getDailyLogs,
  deleteDietLog,
});
type PropsFromRedux = ConnectedProps<typeof connector>;

const DietLog: React.FC<PropsFromRedux> = ({
  dietLogs,
  dietLogsLoading,
  getDietLogs,
  dailyLogs,
  dailyLogsLoading,
  getDailyLogs,
  deleteDietLogLoading,
  deleteDietLog,
}) => {
  React.useEffect(() => {
    if (!dietLogs && !dietLogsLoading) getDietLogs();
    if (!dailyLogs && !dailyLogsLoading) getDailyLogs();
  }, [
    dietLogs,
    dietLogsLoading,
    getDietLogs,
    dailyLogs,
    dailyLogsLoading,
    getDailyLogs,
  ]);

  const params = useParams();
  const router = useRouter();

  const logId = params.id ? parseInt(params.id as string) : null;

  const log = React.useMemo(() => {
    return dietLogs?.find((log) => log.id === logId);
  }, [dietLogs, logId]);

  const nextLog = React.useMemo(() => {
    if (!dietLogs || !log) return null;

    const sortedLogs = [...dietLogs].sort((a, b) =>
      a.effectiveDate.localeCompare(b.effectiveDate)
    );

    const index = sortedLogs.findIndex((d) => d.id === log.id);
    return sortedLogs[index + 1] ?? null;
  }, [dietLogs, log]);

  const filteredDailyLogs = React.useMemo(() => {
    if (!dailyLogs || !log) return [];

    const start = log.effectiveDate;
    const end = nextLog?.effectiveDate ?? null;

    return dailyLogs.filter((dl) => {
      const date = dl.date;
      return end ? date >= start && date < end : date >= start;
    });
  }, [dailyLogs, log, nextLog]);

  if (dietLogsLoading || dailyLogsLoading || deleteDietLogLoading) {
    return <LogLoadingPage />;
  } else if (!log) {
    return (
      <div className="w-full">
        <Card className="w-full rounded-sm p-0">
          <CardContent className="p-4">
            <p>
              There was no log found with this ID. If you think this was a
              mistake, please contact your coach.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="w-full mb-20">
      <Card className="w-full rounded-sm p-0">
        <CardContent className="flex flex-col md:flex-row justify-between grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <div>
            <StatisticsGraph
              dailyLogs={filteredDailyLogs}
              title="Weight Changes this Diet Log"
              unit="lbs"
              dataKeys={["weight"]}
              showUnit
              rounding={2}
              primaryKey="weight"
              subtitle="this calorie adjustment"
            />
          </div>
          <div>
            <div className="mb-6 flex justify-between items-center">
              <H3>Diet Change #{log.id}</H3>
              <Button
                className="ml-2"
                variant="outline"
                onClick={() => {
                  if (log.id) {
                    deleteDietLog(log.id);
                    router.push("/diet");
                  }
                }}
              >
                <Trash className=" font-extrabold" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <FieldValue title="Effective Date" value={log.effectiveDate} />
              <FieldValue title="Phase" value={log.phase} />
              <FieldValue title="Calories" value={log.calories} />
              <FieldValue title="Water" value={log.water + "oz"} />
            </div>
            <div className="py-4">
              <FieldValue title="Notes" value={log.notes} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <FieldValue title="Protein" value={log.protein + "g"} />
              <FieldValue title="Carbs" value={log.carbs + "g"} />
              <FieldValue title="Fat" value={log.fat + "g"} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-0">
          <Accordion type="single" collapsible className="border-t-1 w-full">
            <AccordionItem value="cardio" className="px-6">
              <AccordionTrigger>Cardio</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <FieldValue title="Cardio (type)" value={log.cardio} />
                  <FieldValue
                    title="Cardio (minutes)"
                    value={log.cardioMinutes + "min"}
                  />
                  <FieldValue title="Steps" value={log.steps + " steps"} />
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="supplements" className="px-6">
              <AccordionTrigger>Supplements</AccordionTrigger>
              <AccordionContent>
                {log.supplements?.length === 0 ? (
                  <p>No supplements were prescribed for this log.</p>
                ) : (
                  <Table className="mt-8">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Supplement</TableHead>
                        <TableHead className="lg:pl-5">Dosage</TableHead>
                        <TableHead className="truncate overflow-hidden">
                          Frequency
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {log.supplements?.map((supp, index) => (
                        <TableRow key={supp.id + "-" + index}>
                          <TableCell>name</TableCell>
                          <TableCell>dosage</TableCell>
                          <TableCell>frequency</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardFooter>
      </Card>
    </div>
  );
};

export default connector(DietLog);
