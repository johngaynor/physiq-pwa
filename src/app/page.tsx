"use client";
import React from "react";
import { useUser } from "@clerk/nextjs";
import { H4, Button, H1, H5, Checkbox } from "@/components/ui";
import { CirclePlus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

const Main = () => {
  const { user } = useUser();

  function DashboardButton(props: {
    header?: string;
    subheader?: string;
    data?: string | number;
  }) {
    const { header = "--", subheader = "--", data } = props;
    return (
      <div className="relative">
        <div className="absolute inset-0 p-2">
          <Button
            variant="outline"
            className="w-full h-full flex flex-col relative"
          >
            <p className="absolute left-2 top-2 text-gray-500">{header}</p>
            {data ? (
              <>
                <H1>{data}</H1>
                <H5>{subheader}</H5>
              </>
            ) : (
              <>
                <CirclePlus className="size-12 font-extrabold" />
                <H5>Record {header}</H5>
              </>
            )}
          </Button>
        </div>
        <div className="pt-[100%]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="scroll-m-20 font-extrabold tracking-tight text-6xl md:text-8xl text-center">
          Bodybuilding Redefined.
        </h1>
      </div>
    );
  } else
    return (
      <div className="py-4">
        <H4 className="pb-4">Today</H4>
        <div className="grid grid-cols-2 grid-rows-2 gap-1 h-full w-full border-2 rounded-md">
          <DashboardButton
            header="Weight"
            subheader="lbs this AM"
            data="187.2"
          />
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

export default Main;
