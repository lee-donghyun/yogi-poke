import { i18n } from "@lingui/core";
import { I18nProvider as LinguiProvider } from "@lingui/react";
import { useLingui } from "@lingui/react/macro";
import { ReactNode } from "react";

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
