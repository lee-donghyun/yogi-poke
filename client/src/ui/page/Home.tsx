import { ChevronRightIcon, KeyIcon } from "@heroicons/react/24/outline";
import { Trans, useLingui } from "@lingui/react/macro";
import { browserSupportsWebAuthn } from "@simplewebauthn/browser";

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
  const { authenticate } = usePasskey();

  return (
    <div>
      <img alt="" className="mx-auto mt-20 size-60" src="/asset/icon.jpg" />
      <div className="fixed inset-x-0 bottom-0 flex flex-col gap-5 p-5">
        <button
          className="flex items-center gap-4 rounded-2xl bg-black p-4 duration-300 active:opacity-60 disabled:opacity-60"
          onClick={() => {
            if (!browserSupportsWebAuthn()) {
              push({
                content: t`이 기기는 Passkey를 지원하지 않습니다. 아이디로 로그인할 수 있습니다.`,
              });
              return;
            }
            authenticate().catch(() => {
              push({
                content: t`사용가능한 Passkey가 없습니다. 아이디로 로그인할 수 있습니다.`,
              });
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
      </div>
    </div>
  );
};
