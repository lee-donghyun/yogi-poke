import { ArrowUpOnSquare } from "../icon/ArrowUpOnSquare.tsx";
import { DevicePhoneMobile } from "../icon/DevicePhoneMobile.tsx";
import { useStackedLayer } from "../provider/StackedLayerProvider.tsx";
import {
  instructionSheet,
  platform,
  pwaHelpUrl,
} from "./Introduction.Platform.tsx";

export const Introduction = () => {
  const overlay = useStackedLayer();
  return (
    <div className="min-h-screen pb-60">
      <div className="flex px-5 pt-32">
        <img
          alt="요기콕콕👉"
          className="size-28 rounded-3xl border"
          src="/asset/icon.jpg"
        />
        <div className="flex flex-1 flex-col justify-between pl-5 pt-2">
          <div>
            <h1 className="text-xl font-bold">요기콕콕!</h1>
            <p className="pt-1 text-sm text-zinc-600">
              빠르고 간결한 최신 소셜 미디어
            </p>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="rounded-full bg-blue-500 px-5 py-0.5 font-medium text-white active:opacity-60"
              onClick={() => {
                overlay(instructionSheet);
              }}
              type="button"
            >
              설치
            </button>
            {typeof navigator?.share === "function" && (
              <button
                className="-mb-1 p-1 text-blue-500 active:opacity-60"
                onClick={() => {
                  void navigator.share({
                    title: "요기콕콕!",
                    url: "https://yogi-poke.vercel.app?mtag=1",
                  });
                }}
                type="button"
              >
                <ArrowUpOnSquare />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="mx-6 mt-4 border-t pt-3">
        <h2 className="text-lg font-bold text-zinc-900">새로운 소식</h2>
        <p className="pt-1 text-xs text-zinc-500">버전 24.08.09</p>
        <p className="pt-2 text-sm text-zinc-600">
          이제 그림을 그려서 콕! 찌를 수 있습니다.
        </p>
      </div>
      <div className="mx-5 mt-8 border-t pt-3">
        <h2 className="text-lg font-bold text-zinc-900">미리보기</h2>
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
            className="w-44 snap-start scroll-mx-6 rounded-2xl border"
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
        <DevicePhoneMobile />
        <p className="pl-1 text-sm">{platform}를 위한 웹 어플리케이션</p>
      </a>
    </div>
  );
};
