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
export const gymFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Gym name is required"),
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
export const gymSubmissionSchema = z.object({
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
export type GymFormData = z.infer<typeof gymFormSchema>;
export type GymSubmissionData = z.infer<typeof gymSubmissionSchema>;

// Transform function to convert form data to submission data
export const transformGymData = (data: GymFormData): GymSubmissionData => {
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
export const gymRawSchema = gymFormSchema;
export const gymSchema = gymSubmissionSchema;
export type GymRawFormData = GymFormData;
