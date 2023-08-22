import "./index.scss";

import * as serviceWorker from "./serviceWorker";

import React, { Fragment } from "react";

import { BrowserRouter } from "react-router-dom";
import MainRoutes from "./routes";
import { Provider } from "react-redux";
import ReactDOM from "react-dom";
import store from "./store/index";

const Root = () => {

  return (
    <Fragment>
      <Provider store={store}>
        <BrowserRouter>
          <MainRoutes />
        </BrowserRouter>
      </Provider>
    </Fragment>
  );
};
ReactDOM.render(<Root />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
