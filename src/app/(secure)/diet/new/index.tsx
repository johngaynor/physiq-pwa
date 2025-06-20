"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../store/reducer";
import { getDietLogs } from "../state/actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  // CardDescription,
} from "@/components/ui/card";
import { DietFormValues } from "./types";
import { Input, Label, H3 } from "@/components/ui";

function mapStateToProps(state: RootState) {
  return {
    dietLogs: state.diet.dietLogs,
    dietLogsLoading: state.diet.dietLogsLoading,
  };
}

const connector = connect(mapStateToProps, { getDietLogs });
type PropsFromRedux = ConnectedProps<typeof connector>;

const initialValues = {
  effectiveDate: new Date().toISOString().split("T")[0],
  carbs: "",
  fat: "",
  protein: "",
  phase: "Cut",
  water: "",
  steps: "",
  cardio: "",
  cardioMinutes: "",
  notes: "",
};

const DietLogForm: React.FC<PropsFromRedux> = ({
  dietLogs,
  dietLogsLoading,
  getDietLogs,
}) => {
  const [formValues, setFormValues] = React.useState<DietFormValues>(
    initialValues as DietFormValues
  );
  React.useEffect(() => {
    if (!dietLogs && !dietLogsLoading) getDietLogs();
  }, [dietLogs, dietLogsLoading, getDietLogs]);

  // const sortedLogs = React.useMemo(() => {
  //   return (
  //     dietLogs?.slice().sort((a, b) => {
  //       return (
  //         new Date(b.effectiveDate).getTime() -
  //         new Date(a.effectiveDate).getTime()
  //       );
  //     }) || []
  //   );
  // }, [dietLogs]);

  function handleOnChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { id, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  if (dietLogsLoading) {
    // return <DashboardLoadingPage />;
    return <h1>loading...</h1>;
  } else
    return (
      <div className="w-full">
        <Card className="w-full dark:bg-[#060B1C]">
          <CardHeader>
            <CardTitle>
              <H3>Nutrition</H3>
            </CardTitle>
            {/* <CardDescription>Showing ___ for the last month</CardDescription> */}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="grid w-full max-w-sm items-center gap-3">
                <Label htmlFor="protein">Protein</Label>
                <Input
                  id="protein"
                  value={formValues.protein}
                  onChange={handleOnChange}
                  placeholder="Protein..."
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-3">
                <Label htmlFor="calories">Carbs</Label>
                <Input
                  id="carbs"
                  value={formValues.carbs}
                  onChange={handleOnChange}
                  placeholder="Carbs..."
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-3">
                <Label htmlFor="fat">Fat</Label>
                <Input
                  id="fat"
                  value={formValues.fat}
                  onChange={handleOnChange}
                  placeholder="Fat..."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
};

export default connector(DietLogForm);
