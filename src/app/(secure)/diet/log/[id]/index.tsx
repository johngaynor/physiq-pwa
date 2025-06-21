"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../../store/reducer";
import { getDietLogs } from "../../state/actions";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "next/navigation";

function mapStateToProps(state: RootState) {
  return {
    dietLogs: state.diet.dietLogs,
    dietLogsLoading: state.diet.dietLogsLoading,
  };
}

const connector = connect(mapStateToProps, { getDietLogs });
type PropsFromRedux = ConnectedProps<typeof connector>;

const DietLog: React.FC<PropsFromRedux> = ({
  dietLogs,
  dietLogsLoading,
  getDietLogs,
}) => {
  React.useEffect(() => {
    if (!dietLogs && !dietLogsLoading) getDietLogs();
  }, [dietLogs, dietLogsLoading, getDietLogs]);

  const params = useParams();

  const logId = params.id ? parseInt(params.id as string) : null;

  const log = React.useMemo(() => {
    return dietLogs?.find((log) => log.id === logId);
  }, [dietLogs]);

  if (dietLogsLoading) {
    return <h1>loading...</h1>;
  } else if (!log) {
    return (
      <div className="w-full">
        <Card className="w-full rounded-sm dark:bg-[#060B1C] p-0">
          <CardContent>
            <h1>Log not found</h1>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="w-full">
      <Card className="w-full rounded-sm dark:bg-[#060B1C] p-0">
        <CardContent>
          <h1>{log.effectiveDate}</h1>
          <h1>{log.calories}</h1>
          <h1>{log.cardio}</h1>
        </CardContent>
      </Card>
    </div>
  );
};

export default connector(DietLog);
