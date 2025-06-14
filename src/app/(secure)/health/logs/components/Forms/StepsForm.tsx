import React from "react";
import { Input, Label } from "@/components/ui";
import { FormWrapper } from "./FormWrapper";

type StepsFormValues = {
  steps: number | string;
};

export function StepsForm({
  Trigger,
  handleSubmit,
  initialValues,
}: {
  Trigger: React.ReactNode;
  handleSubmit: (values: StepsFormValues) => void;
  initialValues: StepsFormValues;
}) {
  return (
    <FormWrapper<StepsFormValues>
      Trigger={Trigger}
      title="Log Steps"
      description="Record yesterday's steps."
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      {(values, handleChange) => (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="steps" className="text-right">
            Steps
          </Label>
          <Input
            id="steps"
            value={values.steps}
            onChange={handleChange}
            className="col-span-3"
            type="number"
          />
        </div>
      )}
    </FormWrapper>
  );
}
