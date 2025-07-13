import { FETCH_ANALYZE_POSE, LOAD_ANALYZE_POSE } from "@/app/store/actionTypes";
import { PhysiqueState, Action } from "./types";

const initialState: PhysiqueState = {
  analyzePoseLoading: false,
  analyzePoseResult: null,
};

export default function physiqueReducer(
  state: PhysiqueState = initialState,
  action: Action
): PhysiqueState {
  switch (action.type) {
    case FETCH_ANALYZE_POSE:
      return {
        ...state,
        analyzePoseLoading: true,
      };

    case LOAD_ANALYZE_POSE:
      return {
        ...state,
        analyzePoseLoading: false,
        analyzePoseResult: action.data,
      };

    default:
      return state;
  }
}
