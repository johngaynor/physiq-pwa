import { combineReducers } from "redux";
import app from "../(secure)/state/reducers";
import health from "../(secure)/health/state/reducers";
import diet from "../(secure)/diet/state/reducers";
import checkins from "../(secure)/checkins/state/reducers";
import physique from "../(secure)/physique/state/reducers";
import training from "../(secure)/training/state/reducers";

const rootReducer = combineReducers({
  app,
  health,
  diet,
  checkins,
  physique,
  training,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
