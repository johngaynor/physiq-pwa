import { combineReducers } from "redux";
import app from "../state/reducers";
import health from "../Health/state/reducers";

const rootReducer = combineReducers({
  app,
  health,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
