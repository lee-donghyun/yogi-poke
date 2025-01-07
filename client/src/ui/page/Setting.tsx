import { useState } from "react";

import { usePasskey } from "../../hook/domain/usePasskey.ts";
import { switch_ } from "../../lib/expify.ts";
import { getPushNotificationSubscription } from "../../service/util.ts";
import { StackedNavigation } from "../base/Navigation.tsx";
import { SettingGroup } from "../base/SettingGroup.tsx";
import { CheckCircleOutline } from "../icon/CheckCircleOutline.tsx";
import { CheckCircleSolid } from "../icon/CheckCircleSolid.tsx";
import { useAuthNavigator, useUser } from "../provider/Auth.tsx";
import { useNotification } from "../provider/Notification.tsx";
import { releaseToken } from "../provider/PwaProvider.tsx";
import { useStackedLayer } from "../provider/StackedLayerProvider.tsx";
import { BlockedUser } from "./Setting.BlockedUser.tsx";
import { Quit } from "./Setting.Quit.tsx";

type Open = "내 계정" | "보안" | "알림" | "정보" | "차단한 계정" | null;

export const Setting = () => {
  useAuthNavigator({ goToAuth: true });
  const overlay = useStackedLayer();
  const push = useNotification();
  const { myInfo, patchUser } = useUser();
  const { register: registerPasskey } = usePasskey();

  const [open, setOpen] = useState<Open>(null);
  const isPushEnabled = !!myInfo?.pushSubscription;
  const onOpenSubgroup = (title: Open) => {
    setOpen((open) => (open === title ? null : title));
  };
  return (
    <div className="min-h-screen">
      <StackedNavigation
        onBack={() => {
          history.back();
        }}
        title="설정"
      />
      <div className="pt-16"></div>
      <div className="p-5">
        <SettingGroup
          onOpenSubgroup={onOpenSubgroup}
          subGroups={[
            {
              children: (
                <button
                  className="flex w-full items-center justify-between rounded-xl py-3 text-start duration-150 active:scale-[98%]"
                  onClick={
                    (async () => {
                      const pushSubscription = isPushEnabled
                        ? null
                        : await getPushNotificationSubscription().catch(
                            () => null,
                          );
                      void patchUser({ pushSubscription });
                    }) as VoidFunction
                  }
                >
                  <div className="pr-5">
                    <p>콕! 찌르기</p>
                    <p className="text-sm text-zinc-600">
                      {myInfo?.email}님이 회원님을 콕 찔렀어요!
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
                </button>
              ),
              open: open === "알림",
              title: "알림",
            },
          ]}
          title="연결"
        />
        <SettingGroup
          onOpenSubgroup={onOpenSubgroup}
          subGroups={[
            {
              children: (
                <button
                  className="flex w-full items-center justify-between rounded-xl py-3 text-start duration-150 active:scale-[98%]"
                  onClick={() => {
                    registerPasskey()
                      .then(() => {
                        push({ content: "Passkey가 등록되었습니다." });
                      })
                      .catch((err: { code: string }) => {
                        push({
                          content: switch_<string, string>(err?.code)
                            .case(
                              "ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED",
                              () => "Passkey가 등록되었습니다.",
                            )
                            .default(() => "다시 시도해주세요."),
                        });
                      });
                  }}
                >
                  Passkey 등록
                </button>
              ),
              open: open === "보안",
              title: "보안",
            },
            {
              children: (
                <>
                  <button
                    className="flex w-full items-center justify-between rounded-xl py-3 text-start text-red-500 duration-150 active:scale-[98%]"
                    key="로그아웃"
                    onClick={() => {
                      if (confirm("로그아웃할까요?")) {
                        releaseToken();
                        location.pathname = "/";
                      }
                    }}
                  >
                    로그아웃
                  </button>
                  <button
                    className="flex w-full items-center justify-between rounded-xl py-3 text-start text-zinc-500 duration-150 active:scale-[98%]"
                    key="탈퇴"
                    onClick={() => overlay(Quit)}
                  >
                    계정 삭제
                  </button>
                </>
              ),
              open: open === "내 계정",
              title: "내 계정",
            },
            {
              children: <BlockedUser />,
              open: open === "차단한 계정",
              title: "차단한 계정",
            },
          ]}
          title="계정"
        />
        <SettingGroup
          onOpenSubgroup={onOpenSubgroup}
          subGroups={[
            {
              children: (
                <>
                  {[
                    { label: "개인정보처리방침", url: "help-privacy.html" },
                    { label: "이용 약관", url: "help-term.html" },
                    { label: "오픈소스 라이브러리", url: "help-license.html" },
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
              open: open === "정보",
              title: "정보",
            },
          ]}
          title="지원"
        />
      </div>
    </div>
  );
};
