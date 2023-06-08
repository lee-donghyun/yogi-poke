import { createDraggableSheet } from "../../component/StackedLayerProvider";
import { usePoke } from "../../hook/usePoke";

const HIDE_LAYER_PERSIST_KEY = "EVENT_LAYER_FIRST_5";
const EventLayer = createDraggableSheet(({ close }) => (
  <div className="p-5">
    <p className="text-xl font-medium">스타벅스 기프티콘 이벤트 ☕️</p>
    <p className="mt-5 text-zinc-900">
      5명을 콕!찌른 회원님께 스타벅스 기프티콘을 드립니다. 아래 링크에서 응모에
      참여할 분의 휴대폰 번호를 입력해주세요!
    </p>
    <div className="mt-7">
      <button
        className="block w-full rounded-xl bg-black p-4 text-white duration-300 active:opacity-60"
        onClick={() => {
          window.open("https://www.naver.com");
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
));
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
