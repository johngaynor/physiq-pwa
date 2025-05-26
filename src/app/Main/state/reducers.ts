import { AppState, Action } from "./types";

const DEFAULT_STATE: AppState = {
  count: 0,
};

export default (state = DEFAULT_STATE, action: Action) => {
  switch (action.type) {
    case "DECREMENT_COUNT":
      return {
        ...state,
        count: state.count - 1,
      };
    case "INCREMENT_COUNT":
      return {
        ...state,
        count: state.count + 1,
      };
    default:
      return state;
  }
};
