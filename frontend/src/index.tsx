import {createRoot} from "react-dom/client";
import * as Sentry from "@sentry/browser";
import React from "react";
import App from "./App";
import "./index.scss";

const container = document.getElementById("root");
const root = createRoot(container!);

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://33ed86d660434abeb0a866dc9d6d4e95@sentry.io/1725688",
  });
}

root.render(<App />);
