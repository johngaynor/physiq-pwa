import React from "react";
import { Input, Label } from "@/components/ui";
import { FormWrapper } from "./FormWrapper";

type BodyfatFormValues = {
  bodyfat: number | string;
};

export function BodyfatForm({
  Trigger,
  handleSubmit,
  initialValues,
}: {
  Trigger: React.ReactNode;
  handleSubmit: (values: BodyfatFormValues) => void;
  initialValues: BodyfatFormValues;
}) {
  return (
    <FormWrapper<BodyfatFormValues>
      Trigger={Trigger}
      title="Log Bodyfat %"
      description="Record this morning's bodyfat %."
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      {(values, handleChange) => (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="bodyfat" className="text-right">
            % Bodyfat
          </Label>
          <Input
            id="bodyfat"
            value={values.bodyfat}
            onChange={handleChange}
            className="col-span-3"
            type="number"
          />
        </div>
      )}
    </FormWrapper>
  );
}
