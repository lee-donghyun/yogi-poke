import { i18n, Messages } from "@lingui/core";
import { detect, fromNavigator, fromStorage } from "@lingui/detect-locale";

export const LOCALE_PERSIST_KEY = "LOCALE";
export enum Locale {
  EN = "en",
  JA = "ja",
  KO = "ko",
}
const DEFAULT_LOCALE = Locale.KO;

const isValidLocale = (locale: unknown): locale is Locale =>
  [Locale.EN, Locale.JA, Locale.KO].includes(locale as Locale);

const detectLocale = () => {
  const detected = detect(
    fromStorage(LOCALE_PERSIST_KEY),
    fromNavigator(),
  )?.split("-")[0];

  if (isValidLocale(detected)) {
    return detected;
  }

  return DEFAULT_LOCALE;
};

export const setLocale = async (locale: Locale) => {
  localStorage.setItem(LOCALE_PERSIST_KEY, locale);
  const { messages } = (await import(`~/locales/${locale}/messages.po`)) as {
    messages: Messages;
  };
  i18n.loadAndActivate({ locale, messages });
};

export const initLocale = () => setLocale(detectLocale());
