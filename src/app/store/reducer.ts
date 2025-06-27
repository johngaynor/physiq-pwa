import { combineReducers } from "redux";
import app from "../(secure)/state/reducers";
import health from "../(secure)/health/state/reducers";
import diet from "../(secure)/diet/state/reducers";
import checkins from "../(secure)/checkins/state/reducers";

const rootReducer = combineReducers({
  app,
  health,
  diet,
  checkins,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
