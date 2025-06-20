"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../store/reducer";
import { getDietLogs } from "../state/actions";
import { DietFormValues } from "./types";
import { Input, Label } from "@/components/ui";
import SectionWrapper from "./components/SectionWrapper";

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

  const calories = React.useMemo(() => {
    const protein = parseFloat(formValues.protein) || 0;
    const carbs = parseFloat(formValues.carbs) || 0;
    const fat = parseFloat(formValues.fat) || 0;

    return protein * 4 + carbs * 4 + fat * 9;
  }, [formValues.protein, formValues.carbs, formValues.fat]);

  if (dietLogsLoading) {
    // return <DashboardLoadingPage />;
    return <h1>loading...</h1>;
  } else
    return (
      <div className="w-full">
        {/* Nutrition */}
        <SectionWrapper title="Nutrition">
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="protein">Protein (g)</Label>
            <Input
              id="protein"
              value={formValues.protein}
              onChange={handleOnChange}
              placeholder="Protein..."
              type="number"
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="calories">Carbs (g)</Label>
            <Input
              id="carbs"
              value={formValues.carbs}
              onChange={handleOnChange}
              placeholder="Carbs..."
              type="number"
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="fat">Fat (g)</Label>
            <Input
              id="fat"
              value={formValues.fat}
              onChange={handleOnChange}
              placeholder="Fat..."
              type="number"
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="fat">Calories (kcal)</Label>
            <Input id="calories" value={calories} disabled />
          </div>
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="water">Water (oz)</Label>
            <Input
              id="water"
              value={formValues.water}
              onChange={handleOnChange}
              placeholder="Water..."
              type="number"
            />
          </div>
        </SectionWrapper>
        {/* Cardio */}
        <SectionWrapper title="Cardio">
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="cardio">Cardio (type)</Label>
            <Input
              id="cardio"
              value={formValues.cardio}
              onChange={handleOnChange}
              placeholder="Cardio..."
              type="text"
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="cardioMinutes">Cardio (min / week)</Label>
            <Input
              id="cardioMinutes"
              value={formValues.cardioMinutes}
              onChange={handleOnChange}
              placeholder="Cardio Minutes..."
              type="number"
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="steps">Steps</Label>
            <Input
              id="steps"
              value={formValues.steps}
              onChange={handleOnChange}
              placeholder="Steps..."
              type="number"
            />
          </div>
        </SectionWrapper>
      </div>
    );
};

export default connector(DietLogForm);
