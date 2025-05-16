import {
  ArrowUpOnSquareIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";
import { Trans, useLingui } from "@lingui/react/macro";

import {
  InstructionSheet,
  platform,
  pwaHelpUrl,
} from "~/ui/overlay/IntroductionSheet.tsx";
import { useStackedLayer } from "~/ui/provider/StackedLayerProvider.tsx";

const VERSION = "25.01.28";

export const Introduction = () => {
  const overlay = useStackedLayer();
  const { t } = useLingui();
  return (
    <div className="min-h-dvh pb-60">
      <div className="flex px-5 pt-32">
        <img
          alt={t`요기콕콕! 로고`}
          className="size-28 rounded-3xl border border-zinc-200"
          src="/asset/icon.jpg"
        />
        <div className="flex flex-1 flex-col justify-between pt-2 pl-5">
          <div>
            <h1 className="text-xl font-bold">
              <Trans>요기콕콕!</Trans>
            </h1>
            <p className="pt-1 text-sm text-zinc-600">
              <Trans>빠르고 간결한 최신 소셜 미디어</Trans>
            </p>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="rounded-full bg-blue-500 px-5 py-0.5 font-medium text-white active:opacity-60"
              onClick={() => {
                overlay(InstructionSheet);
              }}
              type="button"
            >
              <Trans>설치</Trans>
            </button>
            {typeof navigator?.share === "function" && (
              <button
                className="-mb-1 p-1 text-blue-500 active:opacity-60"
                onClick={() => {
                  void navigator.share({
                    title: t`요기콕콕!`,
                    url: "https://yogi-poke.vercel.app?mtag=1",
                  });
                }}
                type="button"
              >
                <ArrowUpOnSquareIcon className="size-6" />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="mx-6 mt-4 border-t border-zinc-200 pt-3">
        <h2 className="text-lg font-bold text-zinc-900">
          <Trans>새로운 소식</Trans>
        </h2>
        <p className="pt-1 text-xs text-zinc-500">
          <Trans>버전 {VERSION}</Trans>
        </p>
        <p className="pt-2 text-sm text-zinc-600">
          <Trans>가까운 친구를 팔로우하세요</Trans>
        </p>
      </div>
      <div className="mx-5 mt-8 border-t border-zinc-200 pt-3">
        <h2 className="text-lg font-bold text-zinc-900">
          <Trans>미리보기</Trans>
        </h2>
      </div>
      <div className="flex max-w-full snap-x snap-mandatory gap-3 overflow-x-scroll scroll-smooth px-5 pt-2">
        {[
          "/preview/home.png",
          "/preview/user.png",
          "/preview/emoji.png",
          "/preview/draw.png",
          "/preview/like.png",
          "/preview/notification.png",
          "/preview/profile-qr.png",
        ].map((src) => (
          <img
            alt=""
            className="w-44 snap-start scroll-mx-6 rounded-2xl border border-zinc-200"
            key={src}
            src={src}
          />
        ))}
      </div>
      <a
        className="flex items-center px-5 pt-3 text-blue-500 active:opacity-60"
        href={pwaHelpUrl}
        rel="noreferrer"
        target="_blank"
      >
        <DevicePhoneMobileIcon className="size-6" />
        <p className="pl-1 text-sm">
          <Trans>{platform}를 위한 웹 어플리케이션</Trans>
        </p>
      </a>
    </div>
  );
};
