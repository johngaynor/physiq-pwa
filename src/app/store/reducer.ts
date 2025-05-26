import { combineReducers } from "redux";
import app from "../Main/state/reducers";

const rootReducer = combineReducers({
  app,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
