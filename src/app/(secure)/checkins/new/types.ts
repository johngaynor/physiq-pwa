import { z } from "zod";

// 1. Raw schema for form input types
export const checkInRawSchema = z.object({
  id: z.number().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  cheats: z.string().optional(),
  comments: z.string().optional(),
  training: z.string().optional(),
  attachments: z
    .array(
      z.object({
        id: z.number().optional(),
        checkInId: z.number().optional(),
        s3Filename: z.string().optional(),
        poseId: z.number().optional(),
      })
    )
    .optional(),
});

// 2. Transformed schema for validation/output
export const checkInSchema = checkInRawSchema.transform((data) => ({
  ...data,
}));

// 3. Types
export type CheckInRawFormData = z.infer<typeof checkInRawSchema>; // use in `useForm`
export type CheckInFormData = z.infer<typeof checkInSchema>; // use on submit
