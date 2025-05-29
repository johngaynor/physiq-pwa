"use client";
import React from "react";
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

type SupplementItem = {
  id: number;
  name: string;
  dosage: string;
  checked: boolean;
};

const SupplementData: SupplementItem[] = [
  { id: 1, name: "Creatine Monohydrate", dosage: "5g", checked: false },
  { id: 2, name: "Pre-Workout", dosage: "1 scoop", checked: true },
  { id: 3, name: "Noxygen Pump Powder", dosage: "1 scoop", checked: false },
  { id: 4, name: "Glutamine", dosage: "5g", checked: false },
  { id: 5, name: "D-Aspartic Acid", dosage: "9000mg", checked: false },
  // { id: 6, name: "Berberine", dosage: "1 Softgel", checked: false },
];

const Dashboard = () => {
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

export default Dashboard;
