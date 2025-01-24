import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import React from "react";
import ReactDOM from "react-dom/client";

import "~/index.css";
import { App } from "~/App.tsx";
import { initLocale } from "~/service/i18n.ts";

dayjs.extend(duration);
void initLocale();

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
