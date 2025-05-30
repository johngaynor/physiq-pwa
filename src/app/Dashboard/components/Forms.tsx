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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  function handleSubmit() {
    onSubmit(formValues);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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

type WeightFormValues = {
  weight: number | string;
};

export function WeightForm({
  Trigger,
  handleSubmit,
}: {
  Trigger: React.ReactNode;
  handleSubmit: (values: WeightFormValues) => void;
}) {
  return (
    <FormWrapper<WeightFormValues>
      Trigger={Trigger}
      title="Log Weight"
      description="Record your morning weight after defecation and before eating or drinking."
      initialValues={{ weight: 187.2 }}
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

// type StepsFormValues = {
//   steps: number | null;
// };

// export function StepsForm(props: {
//   Trigger: React.ReactNode;
//   handleSubmit: (values: StepsFormValues) => void;
// }) {
//   const { Trigger, handleSubmit } = props;

//   return (
//     <FormWrapper
//       Trigger={Trigger}
//       title="Log Steps"
//       description="Enter yesterday's steps."
//       onSubmit={handleSubmit} // typing for submit form is null... need to fix later
//     >
//       {/* Want to figure out how to make adjustable columns, specifically for sleep */}
//       <div className="grid grid-cols-4 items-center gap-4">
//         <Label htmlFor="weight" className="text-right">
//           Steps
//         </Label>
//         <Input id="steps" value={10342} className="col-span-3" />
//       </div>
//     </FormWrapper>
//   );
// }
