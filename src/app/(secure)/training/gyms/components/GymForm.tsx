import React from "react";
import { Input, Label } from "@/components/ui";
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

type GymFormValues = {
  name: string;
  address: string;
};

type GymFormProps = {
  Trigger: React.ReactNode;
  title?: string;
  description?: string;
  initialValues: GymFormValues;
  onSubmit: (values: GymFormValues) => void;
};

export function GymForm({
  Trigger,
  title = "Add Gym",
  description = "Create a new gym or edit an existing one.",
  initialValues,
  onSubmit,
}: GymFormProps) {
  const [formValues, setFormValues] =
    React.useState<GymFormValues>(initialValues);
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
    if (!formValues.name.trim() || !formValues.address.trim()) {
      return; // Don't submit if name or address is empty
    }
    onSubmit(formValues);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] top-[20%] translate-y-0 max-h-[500px] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 flex-1 overflow-y-auto">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Gym Name
            </Label>
            <Input
              id="name"
              value={formValues.name}
              onChange={handleChange}
              className="col-span-3"
              type="text"
              placeholder="Enter gym name..."
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
            <Input
              id="address"
              value={formValues.address}
              onChange={handleChange}
              className="col-span-3"
              type="text"
              placeholder="Enter gym address..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!formValues.name.trim() || !formValues.address.trim()}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
