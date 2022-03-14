import { combineReducers } from "redux";

// import auth from "./reducers/auth";

import auth from "./reducers/auth";
import profile from "./reducers/profile";
import question from "./reducers/question";
import streak from "./reducers/streak";
import tag from "./reducers/tag";

const rootReducer = combineReducers({
  auth,
  profile,
  question,
  streak,
  tag,
});

export default rootReducer;
