export type DietPhase = "Cut" | "Bulk" | "Maintenance";
export type DietFormValues = {
  effectiveDate: string;
  carbs: string;
  fat: string;
  protein: string;
  phase: DietPhase;
  water: string;
  steps: string;
  cardio: string;
  cardioMinutes: string;
  notes: string;
};
