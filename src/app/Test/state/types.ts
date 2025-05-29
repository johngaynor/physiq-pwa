export interface AppState {
  count: number;
}

export type Action = { type: "INCREMENT_COUNT" } | { type: "DECREMENT_COUNT" };
