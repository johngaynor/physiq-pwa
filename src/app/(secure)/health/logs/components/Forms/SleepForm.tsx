import React from "react";
import { Input, Label } from "@/components/ui";
import { FormWrapper } from "./FormWrapper";
import { z } from "zod";

const sleepFormSchema = z.object({
  totalSleep: z.number().min(0),
  recoveryIndex: z.number().min(0).max(100),
  readinessScore: z.number().min(0).max(100),
  awakeQty: z.number().min(0),
  remQty: z.number().min(0),
  lightQty: z.number().min(0),
  deepQty: z.number().min(0),
  totalBed: z.number().min(0),
  bedtimeStart: z.string(),
  bedtimeEnd: z.string(),
  efficiency: z.number().min(0),
  sleepScore: z.number().min(0).max(100),
  timingScore: z.number().min(0).max(100),
  restfulnessScore: z.number().min(0).max(100),
  latency: z.number().min(0),
});

type SleepFormValues = {
  totalSleep: string | number;
  recoveryIndex: string | number;
  readinessScore: string | number;
  awakeQty: string | number;
  remQty: string | number;
  lightQty: string | number;
  deepQty: string | number;
  totalBed: string | number;
  bedtimeStart: string;
  bedtimeEnd: string;
  efficiency: string | number;
  sleepScore: string | number;
  timingScore: string | number;
  restfulnessScore: string | number;
  latency: string | number;
};

export function SleepForm({
  Trigger,
  handleSubmit,
  initialValues,
}: {
  Trigger: React.ReactNode;
  handleSubmit: (values: SleepFormValues) => void;
  initialValues: SleepFormValues;
}) {
  const handleFormSubmit = (values: SleepFormValues) => {
    try {
      // Convert string values to numbers for validation
      const numericValues = {
        ...values,
        totalSleep: Number(values.totalSleep),
        recoveryIndex: Number(values.recoveryIndex),
        readinessScore: Number(values.readinessScore),
        awakeQty: Number(values.awakeQty),
        remQty: Number(values.remQty),
        lightQty: Number(values.lightQty),
        deepQty: Number(values.deepQty),
        totalBed: Number(values.totalBed),
        efficiency: Number(values.efficiency),
        sleepScore: Number(values.sleepScore),
        timingScore: Number(values.timingScore),
        restfulnessScore: Number(values.restfulnessScore),
        latency: Number(values.latency),
      };

      // Validate with Zod schema
      const validatedData = sleepFormSchema.parse(numericValues);

      // Pass validated data to the original handler
      handleSubmit(validatedData as SleepFormValues);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const errorMessages = error.errors
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join("\n");
        alert(`Validation Error:\n${errorMessages}`);
      } else {
        alert("An unexpected error occurred");
      }
    }
  };

  return (
    <FormWrapper<SleepFormValues>
      Trigger={Trigger}
      title="Log Sleep"
      description="Record last night's sleep."
      initialValues={initialValues}
      onSubmit={handleFormSubmit}
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
              step="0.1"
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
              step="0.1"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="recoveryIndex" className="text-right">
              Recovery Index
            </Label>
            <Input
              id="recoveryIndex"
              value={values.recoveryIndex}
              onChange={handleChange}
              className="col-span-3"
              type="number"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="readinessScore" className="text-right">
              Readiness Score
            </Label>
            <Input
              id="readinessScore"
              value={values.readinessScore}
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
              step="0.1"
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
              step="0.1"
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
              step="0.1"
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
              step="0.1"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bedtimeStart" className="text-right">
              Bedtime Start
            </Label>
            <Input
              id="bedtimeStart"
              value={values.bedtimeStart}
              onChange={handleChange}
              className="col-span-3"
              type="time"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bedtimeEnd" className="text-right">
              Bedtime End
            </Label>
            <Input
              id="bedtimeEnd"
              value={values.bedtimeEnd}
              onChange={handleChange}
              className="col-span-3"
              type="time"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="efficiency" className="text-right">
              Efficiency
            </Label>
            <Input
              id="efficiency"
              value={values.efficiency}
              onChange={handleChange}
              className="col-span-3"
              type="number"
              step="0.1"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sleepScore" className="text-right">
              Sleep Score
            </Label>
            <Input
              id="sleepScore"
              value={values.sleepScore}
              onChange={handleChange}
              className="col-span-3"
              type="number"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="timingScore" className="text-right">
              Timing Score
            </Label>
            <Input
              id="timingScore"
              value={values.timingScore}
              onChange={handleChange}
              className="col-span-3"
              type="number"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="restfulnessScore" className="text-right">
              Restfulness Score
            </Label>
            <Input
              id="restfulnessScore"
              value={values.restfulnessScore}
              onChange={handleChange}
              className="col-span-3"
              type="number"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="latency" className="text-right">
              Latency
            </Label>
            <Input
              id="latency"
              value={values.latency}
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
