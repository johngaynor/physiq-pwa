export interface Filters {
  search: string;
  cost: number[];
  dayPasses: (boolean | null)[];
  sortMethod: "costAsc" | "costDesc" | "ratingAsc" | "ratingDesc";
  tags: string[];
}

export const initialFilters: Filters = {
  search: "",
  cost: [1, 2, 3],
  dayPasses: [true, false, null],
  sortMethod: "ratingDesc",
  tags: [],
};
