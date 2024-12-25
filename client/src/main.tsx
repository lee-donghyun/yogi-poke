import * as Sentry from "@sentry/react";
import { disableBodyScroll } from "body-scroll-lock-upgrade";
import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { App } from "./App.tsx";

Sentry.init({
  dsn: "https://37e4abc51989cf0249d52d49685e20ae@o4505527670210560.ingest.us.sentry.io/4508528810917888",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  tracePropagationTargets: [
    "localhost",
    import.meta.env.VITE_YOGI_POKE_API_URL,
  ],
  tracesSampleRate: 1.0,
});

disableBodyScroll(document.body);

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
