export interface Filters {
  search: string;
  cost: number[];
  dayPasses: (number | null)[];
  sortMethod: "costAsc" | "costDesc" | "ratingAsc" | "ratingDesc";
  tags: string[];
  latitude: number | null;
  longitude: number | null;
  distance: number;
}

export const initialFilters: Filters = {
  search: "",
  cost: [1, 2, 3],
  dayPasses: [1, 0, null],
  sortMethod: "ratingDesc",
  tags: [],
  latitude: null,
  longitude: null,
  distance: 10,
};
