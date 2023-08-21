import { JSX, useRef,useState } from "react";

import { useUser } from "../component/Auth";
import { StackedNavigation } from "../component/Navigation";
import { releaseToken } from "../component/PwaProvider";
import { getPushNotificationSubscription } from "../service/util";

type Open = null | "알림" | "로그아웃" | "정보";

const ChevronRightIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.25 4.5l7.5 7.5-7.5 7.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const CheckCircleOutlineIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckCircleSolidIcon = () => (
  <svg
    className="h-6 w-6"
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      clipRule="evenodd"
      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
      fillRule="evenodd"
    />
  </svg>
);

const SettingGroup = <T extends string>({
  subGroups,
  title,
  onOpenSubgroup,
}: {
  title: string;
  subGroups: {
    open: boolean;
    title: T;
    children: JSX.Element;
  }[];
  onOpenSubgroup: (title: T) => void;
}) => {
  const chidlrenRef = useRef<HTMLDivElement>(null);
  return (
    <div className="bg-white pb-10">
      <h4 className="text-sm font-medium text-zinc-400">{title}</h4>
      <div>
        {subGroups.map((subGroup) => (
          <div key={subGroup.title}>
            <div
              className="flex items-center justify-between py-4 text-lg font-medium"
              onClick={() => {
                onOpenSubgroup(subGroup.title);
              }}
            >
              {subGroup.title}
              <span
                className={`duration-300 ${
                  subGroup.open ? "rotate-90" : "text-zinc-700"
                }`}
              >
                <ChevronRightIcon />
              </span>
            </div>
            <div
              className="overflow-hidden duration-300"
              style={
                subGroup.open
                  ? { height: chidlrenRef.current?.offsetHeight, opacity: 1 }
                  : { height: 0, opacity: 0 }
              }
            >
              <div ref={chidlrenRef} className="rounded-xl bg-zinc-50 px-3">
                {subGroup.children}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Setting = () => {
  const { myInfo, patchUser, assertAuth } = useUser();
  assertAuth();
  const [open, setOpen] = useState<Open>(null);
  const isPushEnabled = !!myInfo?.pushSubscription;
  const onOpenSubgroup = (title: Open) =>
    setOpen((open) => (open === title ? null : title));
  return (
    <div className="min-h-screen">
      <StackedNavigation onBack={() => history.back()} title="설정" />
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
                  onClick={async () => {
                    const pushSubscription = isPushEnabled
                      ? null
                      : await getPushNotificationSubscription();
                    patchUser({ pushSubscription });
                  }}
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
                      <CheckCircleSolidIcon />
                    ) : (
                      <CheckCircleOutlineIcon />
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
                          `https://storage.googleapis.com/yogi-poke-assets/help${url}`
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
