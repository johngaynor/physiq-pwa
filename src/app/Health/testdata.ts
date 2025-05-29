type SupplementItem = {
  id: number;
  name: string;
  dosage: string;
  checked: boolean;
};

export const SupplementData: SupplementItem[] = [
  { id: 1, name: "Creatine Monohydrate", dosage: "5g", checked: false },
  { id: 2, name: "Pre-Workout", dosage: "1 scoop", checked: true },
  { id: 3, name: "Noxygen Pump Powder", dosage: "1 scoop", checked: false },
  { id: 4, name: "Glutamine", dosage: "5g", checked: false },
  { id: 5, name: "D-Aspartic Acid", dosage: "9000mg", checked: false },
  // { id: 6, name: "Berberine", dosage: "1 Softgel", checked: false },
];
