import { ChevronRightIcon, KeyIcon } from "@heroicons/react/24/outline";
import { Trans, useLingui } from "@lingui/react/macro";

import { usePasskey } from "~/hook/domain/usePasskey.ts";
import { PrivateLoginSheet } from "~/ui/overlay/PrivateLoginSheet.tsx";
import { useAuthNavigator } from "~/ui/provider/Auth.tsx";
import { useNotification } from "~/ui/provider/Notification.tsx";
import { useStackedLayer } from "~/ui/provider/StackedLayerProvider.tsx";

export const Home = () => {
  useAuthNavigator({ goToApp: "/search" });
  const overlay = useStackedLayer();
  const push = useNotification();
  const { t } = useLingui();
  const { authenticate, canAuthenticate } = usePasskey();

  const showPasskeyButton = canAuthenticate();

  return (
    <main>
      <img
        alt={t`요기콕콕! 로고`}
        className="mx-auto mt-20 size-60"
        src="/asset/icon.jpg"
      />
      <fieldset className="fixed inset-x-0 bottom-0 flex flex-col gap-5 p-5">
        <legend className="sr-only">
          <Trans>로그인 방법 선택</Trans>
        </legend>
        {showPasskeyButton && (
          <>
            <button
              className="flex items-center gap-4 rounded-2xl bg-black p-4 duration-300 active:opacity-60 disabled:opacity-60"
              onClick={() => {
                authenticate().catch(() => {
                  push({ content: t`다시 시도해주세요.` });
                });
              }}
              type="button"
            >
              <span className="text-zinc-100">
                <KeyIcon className="size-6" />
              </span>
              <p className="flex-1 text-left text-white">
                <Trans>Passkey로 시작하기</Trans>
              </p>
              <span className="text-zinc-500">
                <ChevronRightIcon className="size-6" />
              </span>
            </button>
            <button
              className="rounded-2xl p-2 text-sm text-zinc-400 duration-300 active:opacity-60"
              onClick={() => overlay(PrivateLoginSheet)}
            >
              <Trans>아이디로 로그인</Trans>
            </button>
          </>
        )}
        {!showPasskeyButton && (
          <button
            className="mb-6 flex items-center gap-4 rounded-2xl bg-black p-4 duration-300 active:opacity-60 disabled:opacity-60"
            onClick={() => overlay(PrivateLoginSheet)}
            type="button"
          >
            <p className="flex-1 pl-2 text-left text-white">
              <Trans>아이디로 로그인</Trans>
            </p>
            <span className="text-zinc-500">
              <ChevronRightIcon className="size-6" />
            </span>
          </button>
        )}
      </fieldset>
    </main>
  );
};
