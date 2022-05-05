import { combineReducers } from "redux";

// import auth from "./reducers/auth";

import auth from "./reducers/auth";
import admin from "./reducers/admin";
import leaderboard from "./reducers/leaderboard";
import profile from "./reducers/profile";
import question from "./reducers/question";
import streak from "./reducers/streak";
import tag from "./reducers/tag";
import contestQuestion from "./reducers/contestQuestion";

const rootReducer = combineReducers({
  auth,
  admin,
  leaderboard,
  profile,
  question,
  streak,
  tag,
  contestQuestion,
});

export default rootReducer;
