export type DietPhase = "Cut" | "Bulk" | "Maintenance";
export type DietFormValues = {
  effectiveDate: string;
  carbs: number | string;
  fat: number | string;
  protein: number | string;
  phase: DietPhase;
  water: number | string;
  steps: number | string;
  cardio: string;
  cardioMinutes: number | string;
  notes: string;
};
