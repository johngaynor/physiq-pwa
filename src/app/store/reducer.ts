import { combineReducers } from "redux";
import health from "../Health/state/reducers";

const rootReducer = combineReducers({
  health,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
