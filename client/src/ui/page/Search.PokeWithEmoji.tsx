import ky from "ky";
import { useRef, useState } from "react";
import useSWR from "swr";

import { usePoke } from "../../hook/domain/usePoke.ts";
import { createDraggableSheet } from "../provider/StackedLayerProvider.tsx";

const EMOJI_DICT_URL = "/asset/emoji.json";

const MESSAGE_LENGTH = 5;

const BOOKMARK = [
  { depth: 0, icon: "😀", title: "스마일리 및 사람" },
  { depth: 6916, icon: "🐵", title: "동물 및 자연" },
  { depth: 8892, icon: "🍇", title: "음식 및 음료" },
  { depth: 10608, icon: "🌍", title: "여행 및 장소" },
  { depth: 13468, icon: "🎃", title: "활동" },
  { depth: 14560, icon: "👓", title: "사물" },
  { depth: 17940, icon: "🏧", title: "기호" },
  { depth: 20852, icon: "🏁", title: "깃발" },
];

const Emoji = ({
  emoji,
  focus,
  onClick,
}: {
  emoji: string;
  focus: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      className={`flex h-28 flex-1 items-center justify-center rounded bg-zinc-50 text-5xl ${focus ? "border-b-4 border-black" : ""}`}
      onClick={onClick}
      type="button"
    >
      {emoji}
    </button>
  );
};

export const PokeWithEmoji = createDraggableSheet<{ email: string }>(
  ({ close, context }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { isMutating, trigger } = usePoke();

    const [input, setInput] = useState<string[]>([]);
    const focusIndex = input.length;

    const [bookmarkPage, setBookmarkPage] = useState(0);

    const { data } = useSWR(EMOJI_DICT_URL, (key) =>
      ky.get(key).json<string[]>(),
    );

    return (
      <div className="py-5">
        <p className="px-5 text-lg font-semibold text-zinc-800">
          이모티콘 찌르기 😊
        </p>
        <div className="flex gap-2 px-5 pt-5">
          {Array.from({ length: MESSAGE_LENGTH }).map((_, index) => (
            <Emoji
              emoji={input[index]}
              focus={index == focusIndex}
              key={`${input[index]}-${index}`}
              onClick={() => setInput((p) => p.slice(0, index))}
            />
          ))}
        </div>
        <div
          className="mx-5 mb-2 mt-7 flex overflow-y-hidden overflow-x-scroll rounded-full bg-zinc-50"
          data-allow-touch-move-on-stacked-layer
          style={{ maxHeight: "28px" }}
        >
          {BOOKMARK.map(({ depth, icon, title }, index) => {
            const isVisible = index === bookmarkPage;
            return (
              <button
                className={`flex items-center gap-1 rounded-full px-2 duration-200 ${isVisible ? "scale-110 bg-zinc-100" : ""}`}
                key={icon}
                onClick={() => {
                  setBookmarkPage(index);
                  containerRef.current?.scroll({ left: depth + 12 });
                }}
                type="button"
              >
                <span className="text-xl">{icon}</span>
                {index === bookmarkPage && (
                  <span className="whitespace-pre text-xs text-zinc-700">
                    {title}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div
          className="overflow-x-scroll"
          data-allow-touch-move-on-stacked-layer
          onScroll={() => {
            const scrollLeft = containerRef.current?.scrollLeft ?? 0;
            const index = BOOKMARK.findLastIndex(
              ({ depth }) => depth < scrollLeft,
            );
            setBookmarkPage(index);
          }}
          ref={containerRef}
          style={{ height: 204 }}
        >
          <div className="grid grid-flow-col grid-rows-4 gap-1 px-5 text-3xl">
            {data?.map((emoji, i) => (
              <button
                className="size-12 rounded-full duration-100 active:scale-90 active:opacity-70"
                key={i}
                onClick={() => {
                  setInput((p) => [...p, emoji].slice(-MESSAGE_LENGTH));
                }}
                type="button"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
        <div className="px-5 pt-10">
          <button
            className="h-12 w-full rounded-2xl bg-black font-medium text-white duration-300 active:bg-zinc-300 disabled:bg-zinc-300"
            disabled={input.length !== MESSAGE_LENGTH || isMutating}
            onClick={() =>
              void trigger({
                email: context.email,
                payload: { message: input.join(""), type: "emoji" },
              }).then(close)
            }
            type="button"
          >
            찌르기 👉
          </button>
        </div>
      </div>
    );
  },
);
