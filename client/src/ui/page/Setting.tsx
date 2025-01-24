import { Trans, useLingui } from "@lingui/react/macro";
import { useState } from "react";

import { usePasskey } from "~/hook/domain/usePasskey.ts";
import { switch_ } from "~/lib/expify.ts";
import { getPushNotificationSubscription } from "~/service/util.ts";
import { AButton } from "~/ui/base/AButton.tsx";
import { StackedNavigation } from "~/ui/base/Navigation.tsx";
import { SettingGroup } from "~/ui/base/SettingGroup.tsx";
import { BlockedUser } from "~/ui/domain/BlockedUser.tsx";
import { CheckCircleOutline } from "~/ui/icon/CheckCircleOutline.tsx";
import { CheckCircleSolid } from "~/ui/icon/CheckCircleSolid.tsx";
import { LanguageSheet } from "~/ui/overlay/LanguageSheet.tsx";
import { QuitStack } from "~/ui/overlay/QuitStack.tsx";
import { useAuthNavigator, useUser } from "~/ui/provider/Auth.tsx";
import { useNotification } from "~/ui/provider/Notification.tsx";
import { releaseToken } from "~/ui/provider/PwaProvider.tsx";
import { useStackedLayer } from "~/ui/provider/StackedLayerProvider.tsx";

enum Menu {
  Account,
  Blocked,
  Information,
  Notification,
  Security,
  Language,
}

type Open = Menu | null;

export const Setting = () => {
  useAuthNavigator({ goToAuth: true });
  const overlay = useStackedLayer();
  const push = useNotification();
  const { t } = useLingui();
  const { myInfo, patchUser } = useUser();
  const { register: registerPasskey } = usePasskey();

  const [open, setOpen] = useState<Open>(null);

  const onOpenSubgroup = (title: Open) => {
    setOpen((open) => (open === title ? null : title));
  };

  const isPushEnabled = !!myInfo?.pushSubscription;
  const myEmail = myInfo?.email;

  return (
    <div className="min-h-dvh">
      <StackedNavigation
        onBack={() => {
          history.back();
        }}
        title={t`설정`}
      />
      <div className="pt-16"></div>
      <div className="p-5">
        <SettingGroup
          onOpenSubgroup={onOpenSubgroup}
          subGroups={[
            {
              children: (
                <AButton
                  className="flex w-full items-center justify-between rounded-xl py-3 text-start duration-150 active:scale-[98%] disabled:opacity-80"
                  onClick={async () => {
                    const pushSubscription = isPushEnabled
                      ? null
                      : await getPushNotificationSubscription().catch(
                          () => null,
                        );
                    void patchUser({ pushSubscription });
                  }}
                >
                  <div className="pr-5">
                    <p>
                      <Trans>콕! 찌르기</Trans>
                    </p>
                    <p className="text-sm text-zinc-600">
                      <Trans>{myEmail}님이 회원님을 콕 찔렀어요!</Trans>
                    </p>
                  </div>
                  <span
                    className={
                      isPushEnabled ? "text-yellow-500" : "text-zinc-400"
                    }
                  >
                    {isPushEnabled ? (
                      <CheckCircleSolid />
                    ) : (
                      <CheckCircleOutline />
                    )}
                  </span>
                </AButton>
              ),
              id: Menu.Notification,
              open: open === Menu.Notification,
              title: t`알림`,
            },
          ]}
          title={t`연결`}
        />
        <SettingGroup
          onOpenSubgroup={onOpenSubgroup}
          subGroups={[
            {
              children: (
                <AButton
                  className="flex w-full items-center justify-between rounded-xl py-3 text-start duration-150 active:scale-[98%] disabled:opacity-80"
                  onClick={() =>
                    registerPasskey()
                      .then(() => {
                        push({ content: t`Passkey가 등록되었습니다.` });
                      })
                      .catch((err: { code: string }) => {
                        push({
                          content: switch_<string, string>(err?.code)
                            .case(
                              "ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED",
                              () => t`Passkey가 등록되었습니다.`,
                            )
                            .default(() => t`다시 시도해주세요.`),
                        });
                      })
                  }
                >
                  <Trans>Passkey 등록</Trans>
                </AButton>
              ),
              id: Menu.Security,
              open: open === Menu.Security,
              title: t`보안`,
            },
            {
              children: (
                <>
                  <button
                    className="flex w-full items-center justify-between rounded-xl py-3 text-start text-red-500 duration-150 active:scale-[98%]"
                    key="로그아웃"
                    onClick={() => {
                      if (confirm(t`로그아웃할까요?`)) {
                        releaseToken();
                        location.pathname = "/";
                      }
                    }}
                  >
                    <Trans>로그아웃</Trans>
                  </button>
                  <button
                    className="flex w-full items-center justify-between rounded-xl py-3 text-start text-zinc-500 duration-150 active:scale-[98%]"
                    key="탈퇴"
                    onClick={() => overlay(QuitStack)}
                  >
                    <Trans>계정 삭제</Trans>
                  </button>
                </>
              ),
              id: Menu.Account,
              open: open === Menu.Account,
              title: t`내 계정`,
            },
            {
              children: <BlockedUser />,
              id: Menu.Blocked,
              open: open === Menu.Blocked,
              title: t`차단한 계정`,
            },
          ]}
          title={t`계정`}
        />
        <SettingGroup
          onOpenSubgroup={onOpenSubgroup}
          subGroups={[
            {
              children: (
                <button
                  className="flex w-full items-center justify-between rounded-xl py-3 text-start duration-150 active:scale-[98%]"
                  onClick={() => {
                    overlay(LanguageSheet);
                  }}
                >
                  <Trans>언어 선택</Trans>
                </button>
              ),
              id: Menu.Language,
              open: open === Menu.Language,
              title: t`언어`,
            },
          ]}
          title={t`내 앱`}
        />
        <SettingGroup
          onOpenSubgroup={onOpenSubgroup}
          subGroups={[
            {
              children: (
                <>
                  {[
                    { label: t`개인정보처리방침`, url: "help-privacy.html" },
                    { label: t`이용 약관`, url: "help-term.html" },
                    { label: t`오픈소스 라이브러리`, url: "help-license.html" },
                  ].map(({ label, url }) => (
                    <button
                      className="flex w-full items-center justify-between rounded-xl py-3 text-start duration-150 active:scale-[98%]"
                      key={label}
                      onClick={() =>
                        window.open(
                          `https://static.is-not-a.store/yogi-poke-assets/${url}`,
                        )
                      }
                    >
                      {label}
                    </button>
                  ))}
                </>
              ),
              id: Menu.Information,
              open: open === Menu.Information,
              title: t`정보`,
            },
          ]}
          title={t`지원`}
        />
      </div>
    </div>
  );
};
