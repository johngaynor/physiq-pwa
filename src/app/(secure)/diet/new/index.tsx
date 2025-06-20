"use client";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../store/reducer";
import { getDietLogs } from "../state/actions";
import { DietFormValues, DietPhase } from "./types";
import { Input, Label, Select } from "@/components/ui";
import { SectionWrapper, InputWrapper } from "./components/SectionWrapper";
import {
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectContent,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";

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
  phase: "",
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
        {/* General */}
        <SectionWrapper title="General">
          <InputWrapper>
            <Label htmlFor="date">Effective Date (YYYY-MM-DD)</Label>
            <Input
              id="date"
              value={formValues.effectiveDate}
              onChange={handleOnChange}
              placeholder="Effective Date..."
              type="text"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={formValues.notes}
              onChange={handleOnChange}
              placeholder="Notes..."
              type="text"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="phase">Phase</Label>
            <Select
              value={formValues.phase}
              onValueChange={(value) =>
                setFormValues((prev) => ({
                  ...prev,
                  phase: value as DietPhase,
                }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Phase..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Phases</SelectLabel>
                  <SelectItem value="bulk">Bulk</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="cut">Cut</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </InputWrapper>
        </SectionWrapper>
        {/* Nutrition */}
        <SectionWrapper title="Nutrition">
          <InputWrapper>
            <Label htmlFor="protein">Protein (g)</Label>
            <Input
              id="protein"
              value={formValues.protein}
              onChange={handleOnChange}
              placeholder="Protein..."
              type="number"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="calories">Carbs (g)</Label>
            <Input
              id="carbs"
              value={formValues.carbs}
              onChange={handleOnChange}
              placeholder="Carbs..."
              type="number"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="fat">Fat (g)</Label>
            <Input
              id="fat"
              value={formValues.fat}
              onChange={handleOnChange}
              placeholder="Fat..."
              type="number"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="fat">Calories (kcal)</Label>
            <Input id="calories" value={calories} disabled />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="water">Water (oz)</Label>
            <Input
              id="water"
              value={formValues.water}
              onChange={handleOnChange}
              placeholder="Water..."
              type="number"
            />
          </InputWrapper>
        </SectionWrapper>
        {/* Cardio */}
        <SectionWrapper title="Cardio">
          <InputWrapper>
            <Label htmlFor="cardio">Cardio (type)</Label>
            <Input
              id="cardio"
              value={formValues.cardio}
              onChange={handleOnChange}
              placeholder="Cardio..."
              type="text"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="cardioMinutes">Cardio (min / week)</Label>
            <Input
              id="cardioMinutes"
              value={formValues.cardioMinutes}
              onChange={handleOnChange}
              placeholder="Cardio Minutes..."
              type="number"
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="steps">Steps</Label>
            <Input
              id="steps"
              value={formValues.steps}
              onChange={handleOnChange}
              placeholder="Steps..."
              type="number"
            />
          </InputWrapper>
        </SectionWrapper>
      </div>
    );
};

export default connector(DietLogForm);
