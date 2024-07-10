import { createDraggableSheet } from "../component/StackedLayerProvider";

const Emoji = ({ emoji, focus }: { emoji: string; focus: boolean }) => {
  return (
    <div
      className={`flex h-28 flex-1 items-center justify-center rounded bg-zinc-50 text-5xl ${focus ? "border-b-4 border-black" : ""}`}
    >
      {emoji}
    </div>
  );
};

export const PokeWithEmoji = createDraggableSheet(() => {
  const input = ["😀", "😀", "😀"];
  const focusIndex = input.length;
  return (
    <div className="p-5">
      <p className="text-lg font-semibold text-zinc-800">이모티콘 찌르기</p>
      <div className="flex gap-2 pt-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Emoji
            key={input[index] + index}
            emoji={input[index]}
            focus={index == focusIndex}
          />
        ))}
      </div>
      <div className="pt-6">
        <button className="w-full rounded-full bg-black p-4 text-white duration-300 active:opacity-60">
          찌르기 👉
        </button>
      </div>
    </div>
  );
});
