import { combineReducers } from "redux";

// import auth from "./reducers/auth";

import auth from "./reducers/auth";
import question from "./reducers/question";
import streak from "./reducers/streak";

const rootReducer = combineReducers({
  auth,
  question,
  streak,
});

export default rootReducer;
