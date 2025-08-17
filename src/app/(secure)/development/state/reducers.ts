import { FETCH_TEST_QUERY, LOAD_TEST_QUERY } from "@/app/store/actionTypes";
import { DevelopmentState, Action } from "./types";

const initialState: DevelopmentState = {
  testData: null,
  testDataLoading: false,
};

export default function developmentReducer(
  state: DevelopmentState = initialState,
  action: Action
): DevelopmentState {
  switch (action.type) {
    case FETCH_TEST_QUERY:
      return {
        ...state,
        testDataLoading: true,
      };

    case LOAD_TEST_QUERY:
      return {
        ...state,
        testDataLoading: false,
        testData: action.data,
      };
    default:
      return state;
  }
}
