import { i18n, Messages } from "@lingui/core";
import { detect, fromNavigator, fromStorage } from "@lingui/detect-locale";
import { I18nProvider as LinguiProvider } from "@lingui/react";
import { ReactNode, useEffect } from "react";

const LOCALE_PERSIST_KEY = "LOCALE";
const DEFAULT_LOCALE = "ko";

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    void (async () => {
      const locale = (
        detect(fromStorage(LOCALE_PERSIST_KEY), fromNavigator()) ??
        DEFAULT_LOCALE
      ).split("-")[0];

      const catalog = (await import(
        `../../locales/${locale}/messages.json`
      )) as { messages: Messages };
      i18n.loadAndActivate({ locale, messages: catalog.messages });
    })();
  }, []);

  return <LinguiProvider i18n={i18n}>{children}</LinguiProvider>;
};
