import { z } from "zod";

// 1. Raw schema for gym form input types
export const gymRawSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Gym name is required"),
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  fullAddress: z.string().min(1, "Address is required"),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  createdBy: z.string().nullable().optional(),
  lastUpdated: z.string().optional(),
  comments: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// 2. Transformed schema for validation/output
export const gymSchema = gymRawSchema.transform((data) => ({
  ...data,
  tags: data.tags || [],
  comments: data.comments || "",
}));

// 3. Types
export type GymRawFormData = z.infer<typeof gymRawSchema>; // use in `useForm`
export type GymFormData = z.infer<typeof gymSchema>; // use on submit
