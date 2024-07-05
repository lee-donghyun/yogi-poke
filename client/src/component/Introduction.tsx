import { ArrowUpOnSquare } from "./icon/ArrowUpOnSquare";
import { DevicePhoneMobile } from "./icon/DevicePhoneMobile";

export const Introduction = () => {
  return (
    <div className="pb-60">
      <div className="flex px-6 pt-32">
        <img
          alt="요기콕콕👉"
          className="size-28 rounded-3xl border"
          src="/asset/icon.jpg"
        />
        <div className="pl-5 pt-2">
          <h1 className="text-xl font-bold">요기콕콕!</h1>
          <p className="pt-1 text-sm text-zinc-600">
            빠르고 간결한 최신 소셜 미디어
          </p>
          {typeof navigator?.share === "function" && (
            <button
              className="-ml-1 mt-2 p-1 text-blue-500 active:opacity-60"
              type="button"
              onClick={() => {
                void navigator.share({
                  title: "요기콕콕!",
                  url: "https://yogi-poke.vercel.app",
                });
              }}
            >
              <ArrowUpOnSquare />
            </button>
          )}
        </div>
      </div>
      <div className="mx-6 mt-4 border-t pt-3">
        <h2 className="text-lg font-bold text-zinc-900">새로운 소식</h2>
        <p className="pt-1 text-xs text-zinc-500">버전 24.07.05</p>
        <p className="pt-2 text-sm text-zinc-600">
          프로필 공유를 위한 QR코드와 스캐너가 추가됩니다.
        </p>
      </div>
      <div className="mx-6 mt-8 border-t pt-3">
        <h2 className="text-lg font-bold text-zinc-900">미리보기</h2>
      </div>
      <div className="flex max-w-full snap-x snap-mandatory gap-3 overflow-x-scroll scroll-smooth px-6 pt-2">
        {[
          "/preview/home.png",
          "/preview/user.png",
          "/preview/like.png",
          "/preview/notification.png",
          "/preview/profile-qr.png",
        ].map((src) => (
          <img
            key={src}
            alt=""
            className="w-44 snap-start scroll-mx-6 rounded-2xl border"
            src={src}
          />
        ))}
      </div>
      <a
        className="flex items-center px-6 pt-3 text-blue-500 active:opacity-60"
        href="https://support.apple.com/ko-kr/guide/iphone/iph42ab2f3a7/17.0/ios/17.0#iph4f9a47bbc"
        rel="noreferrer"
        target="_blank"
      >
        <DevicePhoneMobile />
        <p className="pl-1 text-sm">iPhone을 위한 웹 어플리케이션</p>
      </a>
    </div>
  );
};
