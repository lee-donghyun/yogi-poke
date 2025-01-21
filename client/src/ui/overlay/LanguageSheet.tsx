import { Trans, useLingui } from "@lingui/react/macro";

import { AButton } from "../base/AButton";
import { createDraggableSheet } from "../base/DraggableSheet";
import { Locale, setLocale } from "../provider/I18nProvider";

export const LanguageSheet = createDraggableSheet(({ close }) => {
  const { t } = useLingui();
  return (
    <div className="p-6 pt-2.5">
      <p className="pb-3 text-lg font-semibold text-zinc-800">
        <Trans>언어 선택</Trans>
      </p>
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
