import React from "react";
import { Input, Label } from "@/components/ui";
import { FormWrapper } from "./FormWrapper";

type CalorieFormValues = {
  calories: number | string;
};

export function CaloriesForm({
  Trigger,
  handleSubmit,
  initialValues,
}: {
  Trigger: React.ReactNode;
  handleSubmit: (values: CalorieFormValues) => void;
  initialValues: CalorieFormValues;
}) {
  return (
    <FormWrapper<CalorieFormValues>
      Trigger={Trigger}
      title="Log Calorie Intake"
      description="Record total calorie intake for the day."
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      {(values, handleChange) => (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="calories" className="text-right">
            Calories
          </Label>
          <Input
            id="calories"
            value={values.calories}
            onChange={handleChange}
            className="col-span-3"
            type="number"
          />
        </div>
      )}
    </FormWrapper>
  );
}
