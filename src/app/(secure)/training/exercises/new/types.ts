import { z } from "zod";

// Helper function to transform latitude/longitude
const transformCoordinate = (val: unknown): number | null => {
  if (val === null || val === undefined || val === "") return null;
  const num =
    typeof val === "string"
      ? parseFloat(val)
      : typeof val === "number"
      ? val
      : null;
  return num !== null && !isNaN(num) ? num : null;
};

// Input form schema (what useForm expects)
export const exerciseFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Exercise name is required"),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  fullAddress: z.string().min(1, "Address is required"),
  latitude: z.union([z.number(), z.string()]).nullable().optional(),
  longitude: z.union([z.number(), z.string()]).nullable().optional(),
  createdBy: z.string().nullable().optional(),
  lastUpdated: z.string().optional(),
  comments: z.string().optional(),
  tags: z.array(z.string()).optional(),
  cost: z.number().min(1).max(3),
  dayPasses: z.number().nullable().optional(),
});

// Output schema (what gets submitted)
export const exerciseSubmissionSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Gym name is required"),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  fullAddress: z.string().min(1, "Address is required"),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  createdBy: z.string().nullable().optional(),
  lastUpdated: z.string().optional(),
  comments: z.string(),
  tags: z.array(z.string()),
  cost: z.number().min(1).max(3),
  dayPasses: z.number().nullable(),
});

// Types
export type ExerciseFormData = z.infer<typeof exerciseFormSchema>;
export type ExerciseSubmissionData = z.infer<typeof exerciseSubmissionSchema>;

// Transform function to convert form data to submission data
export const transformExerciseData = (
  data: ExerciseFormData
): ExerciseSubmissionData => {
  return {
    ...data,
    latitude: transformCoordinate(data.latitude),
    longitude: transformCoordinate(data.longitude),
    comments: data.comments || "",
    tags: data.tags || [],
    dayPasses: data.dayPasses !== undefined ? data.dayPasses : null,
  };
};

// Keep these for backward compatibility
export const exerciseRawSchema = exerciseFormSchema;
export const exerciseSchema = exerciseSubmissionSchema;
export type ExerciseRawFormData = ExerciseFormData;
