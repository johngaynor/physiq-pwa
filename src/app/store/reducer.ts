import { combineReducers } from "redux";
import app from "../(secure)/state/reducers";
import health from "../(secure)/health/state/reducers";

const rootReducer = combineReducers({
  app,
  health,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
