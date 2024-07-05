import { ArrowUpOnSquare } from "../component/icon/ArrowUpOnSquare";
import { createDraggableSheet } from "../component/StackedLayerProvider";
import { switch_ } from "../lib/expify";

enum Platform {
  IOS = "iOS",
  ANDROID = "Android",
  OTHERS = "모바일",
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

const iosInstruction = () => (
  <div className="max-h-[40vh] overflow-y-scroll p-5 pb-32">
    <h3 className="font-semibold text-zinc-800">
      홈 화면에 요기콕콕! 설치하기
    </h3>
    <p className="pt-4 text-sm text-zinc-600">
      iPhone 홈 화면에 요기콕콕!을 추가하여 어플리케이션을 간편하게 설치할 수
      있습니다.
    </p>
    <ol className="list-decimal pl-5 pt-3 text-sm text-zinc-600">
      <li>
        웹 사이트를 보는 동안 메뉴 막대에서{" "}
        <ArrowUpOnSquare className="inline-block size-5 text-blue-500" />을
        탭하십시오.
      </li>
      <li className="mt-2">
        옵션 목록을 아래로 스크롤한 다음, ‘홈 화면에 추가’를 탭하십시오.
      </li>
    </ol>
    <img
      alt="아이폰 홈 화면에 추가 미리보기"
      className="h-96 pt-3"
      src="/preview/add-to-home-screen.png"
    />
  </div>
);

const androidInstruction = () => (
  <div className="p-5 pb-32">
    <h3 className="font-semibold text-zinc-800">
      홈 화면에 요기콕콕! 설치하기
    </h3>
    <p className="pt-4 text-sm text-zinc-600">
      Android 기기 홈 화면에 요기콕콕!을 추가하여 어플리케이션을 간편하게 설치할
      수 있습니다.
    </p>
    <ol className="list-decimal pl-5 pt-3 text-sm text-zinc-600">
      <li>
        주소 표시줄 오른쪽에서 더보기 {">"} 홈 화면에 추가 {">"} 설치를
        탭합니다.
      </li>
      <li className="mt-2">화면에 표시된 안내를 따릅니다.</li>
    </ol>
  </div>
);

export const instructionSheet = switch_<
  Platform,
  ReturnType<typeof createDraggableSheet>
>(platform)
  .case(Platform.ANDROID, () => createDraggableSheet(androidInstruction))
  .case(Platform.IOS, () => createDraggableSheet(iosInstruction))
  .default(() => createDraggableSheet(androidInstruction));
