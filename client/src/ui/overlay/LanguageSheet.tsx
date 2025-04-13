import { Trans, useLingui } from "@lingui/react/macro";

import { Locale, setLocale } from "~/service/i18n";
import { AButton } from "~/ui/base/AButton";
import { createDraggableSheet } from "~/ui/base/DraggableSheet";

export const LanguageSheet = createDraggableSheet(({ close, titleId }) => {
  const { t } = useLingui();
  return (
    <div className="p-6 pt-2.5">
      <h1 className="pb-3 text-lg font-semibold text-zinc-800" id={titleId}>
        <Trans>언어 선택</Trans>
      </h1>
      {[
        { label: "한국어", locale: Locale.KO, translatedLabel: t`한국어` },
        // eslint-disable-next-line lingui/no-unlocalized-strings
        { label: "English", locale: Locale.EN, translatedLabel: t`영어` },
        { label: "日本語", locale: Locale.JA, translatedLabel: t`일본어` },
      ].map(({ label, locale, translatedLabel }) => (
        <AButton
          className="w-full rounded-xl py-3 text-start duration-150 active:scale-[98%] disabled:opacity-80"
          key={label}
          onClick={async () => {
            await setLocale(locale);
            close();
          }}
        >
          <p>{label}</p>
          <p className="mt-0.5 text-sm text-zinc-500">{translatedLabel}</p>
        </AButton>
      ))}
    </div>
  );
});
