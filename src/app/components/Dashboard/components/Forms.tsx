import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label, Input, Button } from "@/components/ui";

type DashboardFormProps<T> = {
  Trigger: React.ReactNode;
  title?: string;
  description?: string;
  onSubmit: (values: T) => void;
  initialValues: T;
  children: (
    formValues: T,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  ) => React.ReactNode;
};

function FormWrapper<T>({
  Trigger,
  title,
  description,
  onSubmit,
  initialValues,
  children,
}: DashboardFormProps<T>) {
  const [formValues, setFormValues] = React.useState<T>(initialValues);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setFormValues(initialValues);
  }, [initialValues]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  function handleSubmit() {
    onSubmit(formValues);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] top-[20%] translate-y-0">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {children(formValues, handleChange)}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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

type SleepFormValues = {
  totalBed: number | string;
  totalSleep: number | string;
  awakeQty: number | string;
  lightQty: number | string;
  remQty: number | string;
  deepQty: number | string;
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

type CalorieFormValues = {
  calories: number;
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
