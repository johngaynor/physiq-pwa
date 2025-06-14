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
import { Button } from "@/components/ui";

export type DashboardFormProps<T> = {
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

export function FormWrapper<T>({
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
