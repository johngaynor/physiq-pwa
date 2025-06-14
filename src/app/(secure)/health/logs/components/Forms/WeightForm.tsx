import React from "react";
import { Input, Label } from "@/components/ui";
import { FormWrapper } from "./FormWrapper";

type WeightFormValues = {
  weight: number | string;
};

export function WeightForm({
  Trigger,
  handleSubmit,
  initialValues,
}: {
  Trigger: React.ReactNode;
  handleSubmit: (values: WeightFormValues) => void;
  initialValues: WeightFormValues;
}) {
  return (
    <FormWrapper<WeightFormValues>
      Trigger={Trigger}
      title="Log Weight"
      description="Record your morning weight after defecation and before eating or drinking."
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      {(values, handleChange) => (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="weight" className="text-right">
            Weight
          </Label>
          <Input
            id="weight"
            value={values.weight}
            onChange={handleChange}
            className="col-span-3"
            type="number"
          />
        </div>
      )}
    </FormWrapper>
  );
}
