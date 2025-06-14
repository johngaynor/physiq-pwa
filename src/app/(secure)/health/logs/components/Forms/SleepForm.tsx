import React from "react";
import { Input, Label } from "@/components/ui";
import { FormWrapper } from "./FormWrapper";

type SleepFormValues = {
  totalBed: number | string;
  totalSleep: number | string;
  awakeQty: number | string;
  lightQty: number | string;
  remQty: number | string;
  deepQty: number | string;
};

// not currently in use
export function SleepForm({
  Trigger,
  handleSubmit,
  initialValues,
}: {
  Trigger: React.ReactNode;
  handleSubmit: (values: SleepFormValues) => void;
  initialValues: SleepFormValues;
}) {
  return (
    <FormWrapper<SleepFormValues>
      Trigger={Trigger}
      title="Log Sleep"
      description="Record last night's sleep."
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      {(values, handleChange) => (
        <>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="totalSleep" className="text-right">
              Total Sleep
            </Label>
            <Input
              id="totalSleep"
              value={values.totalSleep}
              onChange={handleChange}
              className="col-span-3"
              type="number"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="totalBed" className="text-right">
              Total Bed
            </Label>
            <Input
              id="totalBed"
              value={values.totalBed}
              onChange={handleChange}
              className="col-span-3"
              type="number"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="awakeQty" className="text-right">
              Awake Qty
            </Label>
            <Input
              id="awakeQty"
              value={values.awakeQty}
              onChange={handleChange}
              className="col-span-3"
              type="number"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lightQty" className="text-right">
              Light Qty
            </Label>
            <Input
              id="lightQty"
              value={values.lightQty}
              onChange={handleChange}
              className="col-span-3"
              type="number"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="remQty" className="text-right">
              REM Qty
            </Label>
            <Input
              id="remQty"
              value={values.remQty}
              onChange={handleChange}
              className="col-span-3"
              type="number"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deepQty" className="text-right">
              Deep Qty
            </Label>
            <Input
              id="deepQty"
              value={values.deepQty}
              onChange={handleChange}
              className="col-span-3"
              type="number"
            />
          </div>
        </>
      )}
    </FormWrapper>
  );
}
