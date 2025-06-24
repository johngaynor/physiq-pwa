import { z } from "zod";

export const dietLogSchema = z.object({
  id: z.number().optional(),
  protein: z.string().min(1, "Protein is required"),
  fat: z.string().min(1, "Fat is required"),
  carbs: z.string().min(1, "Carbs are required"),
  water: z.string().min(1, "Water intake is required"),
  effectiveDate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Effective date must be in YYYY-MM-DD format"
    ),
  notes: z.string().min(1, "Notes are required"),
  phase: z.enum(["Cut", "Maintenance", "Bulk"], {
    errorMap: () => ({ message: "Phase is required" }),
  }),
  cardioMinutes: z.string().min(1, "Cardio minutes are required"),
  cardio: z.string().min(1, "Cardio is required"),
  steps: z.string().min(1, "Steps are required"),
  supplements: z.array(
    z.object({
      supplementId: z.number(),
      dosage: z.string().min(1, "Dosage is required"),
      frequency: z.string().min(1, "Frequency is required"),
    })
  ),
  calories: z.number().optional(),
});

export type DietLogFormData = z.infer<typeof dietLogSchema>;
