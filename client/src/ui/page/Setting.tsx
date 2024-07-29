import { useState } from "react";

import { VoidFunction } from "../../service/type.ts";
import { getPushNotificationSubscription } from "../../service/util.ts";
import { StackedNavigation } from "../base/Navigation.tsx";
import { SettingGroup } from "../base/SettingGroup.tsx";
import { CheckCircleOutline } from "../icon/CheckCircleOutline.tsx";
import { CheckCircleSolid } from "../icon/CheckCircleSolid.tsx";
import { useUser } from "../provider/Auth.tsx";
import { releaseToken } from "../provider/PwaProvider.tsx";
import { useStackedLayer } from "../provider/StackedLayerProvider.tsx";
import { BlockedUser } from "./Setting.BlockedUser.tsx";
import { Quit } from "./Setting.Quit.tsx";

type Open = null | "알림" | "내 계정" | "차단한 계정" | "정보";

export const Setting = () => {
  const { myInfo, patchUser } = useUser({ assertAuth: true });
  const overlay = useStackedLayer();

  const [open, setOpen] = useState<Open>(null);
  const isPushEnabled = !!myInfo?.pushSubscription;
  const onOpenSubgroup = (title: Open) => {
    setOpen((open) => (open === title ? null : title));
  };
  return (
    <div className="min-h-screen">
      <StackedNavigation
        title="설정"
        onBack={() => {
          history.back();
        }}
      />
      <div className="pt-16"></div>
      <div className="p-5">
        <SettingGroup
          onOpenSubgroup={onOpenSubgroup}
          title="연결"
          subGroups={[
            {
              title: "알림",
              open: open === "알림",
              children: (
                <button
                  className="flex w-full items-center justify-between rounded-xl py-3 text-start duration-150 active:scale-[98%]"
                  onClick={
                    (async () => {
                      const pushSubscription = isPushEnabled
                        ? null
                        : await getPushNotificationSubscription();
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
            },
          ]}
        />
        <SettingGroup
          onOpenSubgroup={onOpenSubgroup}
          title="계정"
          subGroups={[
            {
              title: "내 계정",
              children: (
                <>
                  <button
                    key="로그아웃"
                    className="flex w-full items-center justify-between rounded-xl py-3 text-start text-red-500 duration-150 active:scale-[98%]"
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
                    key="탈퇴"
                    className="flex w-full items-center justify-between rounded-xl py-3 text-start text-zinc-500 duration-150 active:scale-[98%]"
                    onClick={() => overlay(Quit)}
                  >
                    계정 삭제
                  </button>
                </>
              ),
              open: open === "내 계정",
            },
            {
              title: "차단한 계정",
              children: <BlockedUser />,
              open: open === "차단한 계정",
            },
          ]}
        />
        <SettingGroup
          onOpenSubgroup={onOpenSubgroup}
          title="지원"
          subGroups={[
            {
              title: "정보",
              children: (
                <>
                  {[
                    { label: "개인정보처리방침", url: "help-privacy.html" },
                    { label: "이용 약관", url: "help-term.html" },
                    { label: "오픈소스 라이브러리", url: "help-license.html" },
                  ].map(({ label, url }) => (
                    <button
                      key={label}
                      className="flex w-full items-center justify-between rounded-xl py-3 text-start duration-150 active:scale-[98%]"
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
            },
          ]}
        />
      </div>
    </div>
  );
};
