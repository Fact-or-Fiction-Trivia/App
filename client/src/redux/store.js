import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";
import LogRocket from "logrocket";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./index";

const middleware = composeWithDevTools(
  applyMiddleware(
    thunkMiddleware,
    createLogger({ collapsed: true }),
    LogRocket.reduxMiddleware()
  )
);
const store = createStore(rootReducer, middleware);

export default store;
