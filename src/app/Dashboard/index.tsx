"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../store/reducer";
import { H4, Checkbox } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardButton } from "./components/Button";
import { SupplementData } from "../Health/testdata";

function mapStateToProps(state: RootState) {
  return {
    dailyLogs: state.health.dailyLogs,
    dailyLogsLoading: state.health.dailyLogsLoading,
  };
}

const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

const Dashboard: React.FC<PropsFromRedux> = ({
  dailyLogs,
  dailyLogsLoading,
}) => {
  return (
    <div className="py-4">
      <H4 className="pb-4">Today</H4>
      <div className="grid grid-cols-2 grid-rows-2 gap-1 h-full w-full border-2 rounded-md">
        {/* <WeightForm
            Trigger={
              <DashboardButton
                header="Weight"
                subheader="lbs this AM"
                data="187.2"
                onSubmit={() => console.log("submitted for weight")}
              />
            }
          /> */}
        <DashboardButton
          header="Steps"
          subheader="Steps yesterday"
          data="10,368"
        />
        <DashboardButton
          header="Sleep"
          subheader="Sleep last night"
          data="7h 12m"
        />
        <DashboardButton
          header="Training"
          subheader="Today's training"
          // data="56m"
        />
      </div>
      <div className="border-2 p-2 rounded-md mt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Supplement</TableHead>
              <TableHead>Dosage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SupplementData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <Checkbox checked={item.checked} />
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.dosage}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default connector(Dashboard);
