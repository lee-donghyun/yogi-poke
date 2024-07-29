import { usePoke } from "../../hook/domain/usePoke.ts";
import { useUser } from "../../ui/provider/Auth.tsx";
import { createDraggableSheet } from "../../ui/provider/StackedLayerProvider.tsx";

const CloseIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 18L18 6M6 6l12 12"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HIDE_LAYER_PERSIST_KEY = "EVENT_LAYER_FIRST_5";
const EventLayer = createDraggableSheet(({ close }) => {
  const { myInfo } = useUser();
  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-xl font-medium">스타벅스 기프티콘 이벤트 ☕️</p>
        <button className="text-zinc-500" onClick={close}>
          <CloseIcon />
        </button>
      </div>
      <p className="mt-5 break-keep text-zinc-900">
        <span className="font-medium">7월 10일</span>까지
        <br />
        <span className="font-medium">5명</span>을 콕! 찌른 회원님 두 분에게
        <br />
        <span className="animate-pulse font-medium text-green-900">
          스타벅스 기프티콘
        </span>
        을 드립니다. <br />
        아래 링크에서 회원님의 휴대폰 번호를 입력해주세요!
      </p>
      <p className="mt-1.5 text-sm text-zinc-300">
        개인정보는 이벤트가 종료된 후 파기됩니다.
      </p>
      <div className="mt-7">
        <button
          className="block w-full rounded-xl bg-black p-4 text-white duration-300 active:opacity-60"
          onClick={() => {
            window.open(
              "https://docs.google.com/forms/d/e/1FAIpQLSeNaE6jbhJgnzPi7nNp04uTmAtZxHeuZqG6Dg4NJNxnTeL_Wg/viewform?usp=pp_url&entry.29515224=" +
                myInfo?.email,
            );
            close();
          }}
        >
          응모하러 가기
        </button>
        <button
          className="mt-4 block w-full rounded-xl bg-zinc-50 p-2 text-black duration-300 active:opacity-60"
          onClick={() => {
            localStorage.setItem(HIDE_LAYER_PERSIST_KEY, "1");
            close();
          }}
        >
          다시 보지 않기
        </button>
      </div>
    </div>
  );
});
export const eventPokeProps: Parameters<typeof usePoke>[0] = {
  onSuccess: ({ stack, push, meta: { myInfo, email } }) => {
    if (
      (myInfo?.pokes ?? 0) > 3 &&
      localStorage.getItem(HIDE_LAYER_PERSIST_KEY) === null
    ) {
      stack(EventLayer);
    } else {
      push({ content: `${email}님을 콕! 찔렀습니다.` });
    }
  },
};
