import { combineReducers } from "redux";
import app from "../Test/state/reducers";

const rootReducer = combineReducers({
  app,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
