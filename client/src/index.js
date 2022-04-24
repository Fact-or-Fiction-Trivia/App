import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./components/App";
import { Router } from "react-router-dom";
import ReactGA from "react-ga";
import { createBrowserHistory } from "history";
import { Provider } from "react-redux";
import store from "./redux/store";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const history = createBrowserHistory();
ReactGA.initialize("UA-141105324-1");
history.listen((location, action) => {
  ReactGA.pageview(location.pathname);
});

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorkerRegistration.register();
