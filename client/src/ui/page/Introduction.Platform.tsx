import { Trans, useLingui } from "@lingui/react/macro";

import { switch_ } from "../../lib/expify.ts";
import { ArrowUpOnSquare } from "../icon/ArrowUpOnSquare.tsx";
import { createDraggableSheet } from "../provider/StackedLayerProvider.tsx";

enum Platform {
  ANDROID = "Android",
  IOS = "iOS",
  OTHERS = "Mobile",
}

export const platform = navigator.userAgent.includes("Android")
  ? Platform.ANDROID
  : navigator.userAgent.includes("iPhone")
    ? Platform.IOS
    : Platform.OTHERS;

export const pwaHelpUrl = switch_<Platform, string>(platform)
  .case(
    Platform.ANDROID,
    () =>
      "https://support.google.com/chrome/answer/9658361?hl=ko&co=GENIE.Platform%3DAndroid",
  )
  .case(
    Platform.IOS,
    () =>
      "https://support.apple.com/ko-kr/guide/iphone/iph42ab2f3a7/17.0/ios/17.0#iph4f9a47bbc",
  )
  .default(
    () =>
      "https://support.google.com/chrome/answer/9658361?hl=ko&co=GENIE.Platform%3DDesktop&oco=0",
  );

const IosInstruction = () => {
  const { t } = useLingui();
  return (
    <div
      className="max-h-[40vh] overflow-y-scroll p-5 pb-32"
      data-allow-touch-move-on-stacked-layer
    >
      <h3 className="font-semibold text-zinc-800">
        <Trans>홈 화면에 요기콕콕! 설치하기</Trans>
      </h3>
      <p className="pt-4 text-sm text-zinc-600">
        <Trans>
          iPhone 홈 화면에 요기콕콕!을 추가하여 어플리케이션을 간편하게 설치할
          수 있습니다.
        </Trans>
      </p>
      <ol className="list-decimal pl-5 pt-3 text-sm text-zinc-600">
        <Trans>
          <li>
            <span className="font-semibold">Safari</span> 브라우저를 열고{" "}
            <a
              className="text-blue-500"
              href="https://yogi-poke.vercel.app?mtag=1"
              rel="noreferrer"
              target="_blank"
            >
              요기콕콕! 웹 사이트
            </a>
            로 이동합니다.
          </li>
          <li>
            웹 사이트를 보는 동안 메뉴 막대에서{" "}
            <ArrowUpOnSquare className="inline-block size-5 text-blue-500" />을
            탭하십시오.
          </li>
          <li className="mt-2">
            옵션 목록을 아래로 스크롤한 다음,{" "}
            <span className="font-semibold">홈 화면에 추가</span>를 탭하십시오.
          </li>
        </Trans>
      </ol>
      <img
        alt={t`아이폰 홈 화면에 추가 미리보기`}
        className="h-96 pt-3"
        src="/preview/add-to-home-screen.png"
      />
    </div>
  );
};

const AndroidInstruction = () => (
  <div className="p-5 pb-32">
    <h3 className="font-semibold text-zinc-800">
      <Trans>홈 화면에 요기콕콕! 설치하기</Trans>
    </h3>
    <p className="pt-4 text-sm text-zinc-600">
      <Trans>
        Android 기기 홈 화면에 요기콕콕!을 추가하여 어플리케이션을 간편하게
        설치할 수 있습니다.
      </Trans>
    </p>
    <ol className="list-decimal pl-5 pt-3 text-sm text-zinc-600">
      <Trans>
        <li>
          주소 표시줄 오른쪽에서 더보기 {">"} 홈 화면에 추가 {">"} 설치를
          탭합니다.
        </li>
        <li className="mt-2">화면에 표시된 안내를 따릅니다.</li>
      </Trans>
    </ol>
  </div>
);

export const InstructionSheet = switch_<
  Platform,
  ReturnType<typeof createDraggableSheet>
>(platform)
  .case(Platform.ANDROID, () => createDraggableSheet(AndroidInstruction))
  .case(Platform.IOS, () => createDraggableSheet(IosInstruction))
  .default(() => createDraggableSheet(AndroidInstruction));
