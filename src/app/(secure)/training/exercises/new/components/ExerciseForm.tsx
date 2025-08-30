"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SectionWrapper,
  InputWrapper,
} from "@/app/(secure)/diet/new/components/FormWrappers";
import { Input, Label, Button } from "@/components/ui";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";

// Exercise form validation schema
const exerciseFormSchema = z.object({
  name: z.string().min(1, "Exercise name is required"),
  defaultPrimaryUnit: z.number().nullable().optional(),
  defaultSecondaryUnit: z.number().nullable().optional(),
  tags: z.array(z.number()).optional(),
});

type ExerciseFormData = z.infer<typeof exerciseFormSchema>;

// Hardcoded exercise units
const EXERCISE_UNITS = [
  { id: 1, name: "Weight", measurement: "number" },
  { id: 2, name: "Reps", measurement: "number" },
  { id: 3, name: "Time", measurement: "time" },
  { id: 4, name: "BPM", measurement: "number" },
];

// Hardcoded muscle group tags
const MUSCLE_GROUPS = [
  { id: 1, name: "Quads" },
  { id: 2, name: "Calves" },
  { id: 3, name: "Hamstrings" },
  { id: 4, name: "Glutes" },
  { id: 5, name: "Abs" },
  { id: 6, name: "Chest" },
  { id: 7, name: "Rear Delts" },
  { id: 8, name: "Front Delts" },
  { id: 9, name: "Side Delts" },
  { id: 10, name: "Triceps" },
  { id: 11, name: "Biceps" },
  { id: 12, name: "Forearms" },
  { id: 13, name: "Back" },
  { id: 14, name: "Cardio" },
];

interface ExerciseFormProps {
  onSubmit: (data: ExerciseFormData) => void;
  onCancel?: () => void;
  exercise?: ExerciseFormData | null;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({
  onSubmit,
  onCancel,
  exercise,
}) => {
  // form setup
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseFormSchema),
    defaultValues: exercise || {
      name: "",
      defaultPrimaryUnit: null,
      defaultSecondaryUnit: null,
      tags: [],
    },
  });

  const handleFormSubmit = (formData: ExerciseFormData) => {
    onSubmit(formData);
  };

  const handleFormError = (errors: any) => {
    console.log("Form validation errors:", errors);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit, handleFormError)}
      className="w-full mb-20"
    >
      {/* General Information */}
      <SectionWrapper
        title="Exercise Information"
        action={
          <div>
            {onCancel && (
              <Button
                variant="outline"
                onClick={onCancel}
                type="button"
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        }
      >
        <InputWrapper error={errors.name?.message}>
          <Label htmlFor="name">Exercise Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter exercise name..."
            {...register("name")}
          />
        </InputWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputWrapper error={errors.defaultPrimaryUnit?.message}>
            <Label htmlFor="defaultPrimaryUnit">Primary Unit</Label>
            <Controller
              control={control}
              name="defaultPrimaryUnit"
              render={({ field }) => (
                <Select
                  value={field.value?.toString() || "none"}
                  onValueChange={(value) =>
                    field.onChange(value === "none" ? null : parseInt(value))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select primary unit..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {EXERCISE_UNITS.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id.toString()}>
                        {unit.name} ({unit.measurement})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </InputWrapper>

          <InputWrapper error={errors.defaultSecondaryUnit?.message}>
            <Label htmlFor="defaultSecondaryUnit">Secondary Unit</Label>
            <Controller
              control={control}
              name="defaultSecondaryUnit"
              render={({ field }) => (
                <Select
                  value={field.value?.toString() || "none"}
                  onValueChange={(value) =>
                    field.onChange(value === "none" ? null : parseInt(value))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select secondary unit..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {EXERCISE_UNITS.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id.toString()}>
                        {unit.name} ({unit.measurement})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </InputWrapper>
        </div>

        <InputWrapper>
          <Label>Muscle Groups</Label>
          <Controller
            control={control}
            name="tags"
            render={({ field }) => (
              <div className="flex flex-col w-full mt-2 gap-2">
                {MUSCLE_GROUPS.map((muscle) => (
                  <div
                    key={muscle.id}
                    className="flex items-center w-full space-x-2"
                  >
                    <Checkbox
                      id={`muscle-${muscle.id}`}
                      checked={field.value?.includes(muscle.id) || false}
                      onCheckedChange={(checked) => {
                        const currentTags = field.value || [];
                        if (checked) {
                          field.onChange([...currentTags, muscle.id]);
                        } else {
                          field.onChange(
                            currentTags.filter((id) => id !== muscle.id)
                          );
                        }
                      }}
                    />
                    <Label
                      htmlFor={`muscle-${muscle.id}`}
                      className="text-sm font-normal cursor-pointer w-full"
                    >
                      {muscle.name}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          />
        </InputWrapper>
      </SectionWrapper>

      <Button type="submit" variant="outline">
        {exercise ? "Update Exercise" : "Create Exercise"}
      </Button>
    </form>
  );
};

export default ExerciseForm;
