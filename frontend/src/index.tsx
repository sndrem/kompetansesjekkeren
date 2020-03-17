import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/browser";
import App from "./App";
import "./index.scss";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://33ed86d660434abeb0a866dc9d6d4e95@sentry.io/1725688"
  });
}

ReactDOM.render(<App />, document.getElementById("root"));
