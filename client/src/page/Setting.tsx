import { useState } from "react";

import { useUser } from "../component/Auth";
import { CheckCircleOutline } from "../component/icon/CheckCircleOutline";
import { CheckCircleSolid } from "../component/icon/CheckCircleSolid";
import { StackedNavigation } from "../component/Navigation";
import { releaseToken } from "../component/PwaProvider";
import { SettingGroup } from "../component/SettingGroup";
import { VoidFunction } from "../service/type";
import { getPushNotificationSubscription } from "../service/util";

type Open = null | "알림" | "로그아웃" | "정보";

export const Setting = () => {
  const { myInfo, patchUser, assertAuth } = useUser();
  assertAuth();
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
              title: "로그아웃",
              children: (
                <button
                  className="flex w-full items-center justify-between rounded-xl py-3 text-start text-red-500 duration-150 active:scale-[98%]"
                  onClick={() => {
                    if (confirm("로그아웃하시겠어요?")) {
                      releaseToken();
                      location.pathname = "/";
                    }
                  }}
                >
                  로그아웃
                </button>
              ),
              open: open === "로그아웃",
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
                    { label: "개인정보처리방침", url: "/privacy.html" },
                    { label: "이용 약관", url: "/term.html" },
                    { label: "오픈소스 라이브러리", url: "/license.html" },
                  ].map(({ label, url }) => (
                    <button
                      key={label}
                      className="flex w-full items-center justify-between rounded-xl py-3 text-start duration-150 active:scale-[98%]"
                      onClick={() =>
                        window.open(
                          `https://storage.googleapis.com/yogi-poke-assets/help${url}`,
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
