import { Messages } from "@lingui/core";
import { Trans, useLingui } from "@lingui/react/macro";

import { AButton } from "../base/AButton";
import { createDraggableSheet } from "../base/DraggableSheet";
import { Locale, LOCALE_PERSIST_KEY } from "../provider/I18nProvider";

export const Language = createDraggableSheet(({ close }) => {
  const { i18n, t } = useLingui();
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
            const catalog = (await import(
              `../../locales/${locale}/messages.json`
            )) as { messages: Messages };
            i18n.loadAndActivate({ locale, messages: catalog.messages });
            localStorage.setItem(LOCALE_PERSIST_KEY, locale);
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
