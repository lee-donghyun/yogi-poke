import "./index.css";

import { disableBodyScroll } from "body-scroll-lock-upgrade";
import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./App.tsx";

disableBodyScroll(document.body);

const rootElement = document.getElementById("root");

rootElement &&
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
