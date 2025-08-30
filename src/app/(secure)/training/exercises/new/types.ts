import { z } from "zod";

// Input form schema (what useForm expects)
export const exerciseFormSchema = z.object({
  name: z.string().min(1, "Exercise name is required"),
  defaultPrimaryUnit: z.number().nullable().optional(),
  defaultSecondaryUnit: z.number().nullable().optional(),
  tags: z.array(z.number()).optional(),
});

// Output schema (what gets submitted)
export const exerciseSubmissionSchema = z.object({
  name: z.string().min(1, "Exercise name is required"),
  defaultPrimaryUnit: z.number().nullable(),
  defaultSecondaryUnit: z.number().nullable(),
  tags: z.array(z.number()),
});

// Types
export type ExerciseFormData = z.infer<typeof exerciseFormSchema>;
export type ExerciseSubmissionData = z.infer<typeof exerciseSubmissionSchema>;

// Transform function to convert form data to submission data
export const transformExerciseData = (
  data: ExerciseFormData
): ExerciseSubmissionData => {
  return {
    name: data.name,
    defaultPrimaryUnit: data.defaultPrimaryUnit || null,
    defaultSecondaryUnit: data.defaultSecondaryUnit || null,
    tags: data.tags || [],
  };
};
