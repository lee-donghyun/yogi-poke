import { i18n, Messages } from "@lingui/core";
import { detect, fromNavigator, fromStorage } from "@lingui/detect-locale";
import { I18nProvider as LinguiProvider } from "@lingui/react";
import { useLingui } from "@lingui/react/macro";
import { ReactNode } from "react";

export const LOCALE_PERSIST_KEY = "LOCALE";
export enum Locale {
  EN = "en",
  JA = "ja",
  KO = "ko",
}
const DEFAULT_LOCALE = Locale.KO;

const detectLocale = () => {
  const detected = detect(
    fromStorage(LOCALE_PERSIST_KEY),
    fromNavigator(),
  )?.split("-")[0];

  if ([Locale.EN, Locale.JA, Locale.KO].includes(detected as Locale)) {
    return detected as Locale;
  }

  return DEFAULT_LOCALE;
};

export const setLocale = async (locale: Locale) => {
  localStorage.setItem(LOCALE_PERSIST_KEY, locale);
  const { messages } = (await import(
    `../../locales/${locale}/messages.po`
  )) as {
    messages: Messages;
  };
  i18n.loadAndActivate({ locale, messages });
};

export const initLocale = () => setLocale(detectLocale());

const Meta = () => {
  const { t } = useLingui();
  return (
    <>
      {/* title 태그 안에는 string 만 들어갈 수 있음. https://react.dev/reference/react-dom/components/title#use-variables-in-the-title */}
      <title>{t`요기콕콕!`}</title>
    </>
  );
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  return (
    <LinguiProvider i18n={i18n}>
      <Meta />
      {children}
    </LinguiProvider>
  );
};
