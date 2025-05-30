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

type DashboardFormProps = {
  Trigger: React.ReactNode;
  title?: string;
  description?: string;
  onSubmit: () => void;
  children: React.ReactNode;
};

function FormWrapper({
  children,
  Trigger,
  title,
  description,
  onSubmit,
}: DashboardFormProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">{children}</div>
        <DialogFooter>
          <Button type="submit" onClick={() => onSubmit()}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type StepsFormValues = {
  steps: number | null;
};

export function StepsForm(props: { Trigger: React.ReactNode }) {
  const { Trigger } = props;

  function handleSubmit(values: StepsFormValues) {
    console.log("submitting form for steps");
  }

  return (
    <FormWrapper
      Trigger={Trigger}
      title="Log Steps"
      description="Enter yesterday's steps."
      onSubmit={() => console.log("submitted for steps")}
      // onSubmit={(values: StepsFormValues) => console.log("submitted for steps")} // typing for submit form is null... need to fix later
    >
      {/* Want to figure out how to make adjustable columns, specifically for sleep */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="weight" className="text-right">
          Steps
        </Label>
        <Input id="steps" value={10342} className="col-span-3" />
      </div>
    </FormWrapper>
  );
}

type WeightFormValues = {
  weight: number | null;
};

export function WeightForm(props: { Trigger: React.ReactNode }) {
  const { Trigger } = props;

  function handleSubmit(values: WeightFormValues) {
    console.log("submitting form for weight");
  }

  return (
    <FormWrapper
      Trigger={Trigger}
      title="Log Weight"
      description="Record your morning weight after defecation and before eating or drinking."
      onSubmit={() => console.log("submitted for weight")}
      // onSubmit={(values: WeightFormValues) => console.log("submitted for weight")} // typing for submit form is null... need to fix later
    >
      {/* Want to figure out how to make adjustable columns, specifically for sleep */}
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="weight" className="text-right">
            Weight
          </Label>
          <Input id="weight" value={187.2} className="col-span-3" />
        </div>
      </div>
    </FormWrapper>
  );
}
