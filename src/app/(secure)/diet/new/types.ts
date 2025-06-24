import { z } from "zod";

// 1. Raw schema for form input types
export const dietLogRawSchema = z.object({
  id: z.number().optional(),
  protein: z.string().min(1, "Protein is required"),
  carbs: z.string().min(1, "Carbs are required"),
  fat: z.string().min(1, "Fat is required"),
  water: z.string().min(1, "Water is required"),
  effectiveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  notes: z.string().min(1, "Notes are required"),
  phase: z.enum(["Cut", "Maintenance", "Bulk"]),
  cardioMinutes: z.string().min(1, "Cardio minutes required"),
  cardio: z.string().min(1, "Cardio is required"),
  steps: z.string().min(1, "Steps are required"),
  supplements: z.array(
    z.object({
      supplementId: z.number(),
      dosage: z.string().min(1),
      frequency: z.string().min(1),
    })
  ),
  calories: z.string().optional(),
});

// 2. Transformed schema for validation/output
export const dietLogSchema = dietLogRawSchema.transform((data) => ({
  ...data,
  id: data.id,
  protein: Math.round(parseFloat(data.protein)),
  carbs: Math.round(parseFloat(data.carbs)),
  fat: Math.round(parseFloat(data.fat)),
  calories:
    parseFloat(data.protein) * 4 +
    parseFloat(data.carbs) * 4 +
    parseFloat(data.fat) * 9,
  water: Math.round(parseFloat(data.water)),
  steps: Math.round(parseFloat(data.steps)),
  cardioMinutes: Math.round(parseFloat(data.cardioMinutes)),
}));

// 3. Types
export type DietLogRawFormData = z.infer<typeof dietLogRawSchema>; // use in `useForm`
export type DietLogFormData = z.infer<typeof dietLogSchema>; // use on submit
