import { disableBodyScroll } from "body-scroll-lock-upgrade";
import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { App } from "./App.tsx";

disableBodyScroll(document.body);

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
