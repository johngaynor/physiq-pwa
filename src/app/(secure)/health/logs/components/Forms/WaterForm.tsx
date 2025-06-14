import React from "react";
import { Input, Label } from "@/components/ui";
import { FormWrapper } from "./FormWrapper";

type WaterFormValues = {
  water: number | string;
};

export function WaterForm({
  Trigger,
  handleSubmit,
  initialValues,
}: {
  Trigger: React.ReactNode;
  handleSubmit: (values: WaterFormValues) => void;
  initialValues: WaterFormValues;
}) {
  return (
    <FormWrapper<WaterFormValues>
      Trigger={Trigger}
      title="Log Water Intake"
      description="Record total water intake for the day."
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      {(values, handleChange) => (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="water" className="text-right">
            Water (in oz)
          </Label>
          <Input
            id="water"
            value={values.water}
            onChange={handleChange}
            className="col-span-3"
            type="number"
          />
        </div>
      )}
    </FormWrapper>
  );
}
