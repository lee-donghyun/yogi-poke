import { msg } from "@lingui/core/macro";
import { Trans, useLingui } from "@lingui/react/macro";
import ky from "ky";
import { useRef, useState } from "react";
import useSWR from "swr";

import { usePoke } from "~/hook/domain/usePoke.ts";
import { createDraggableSheet } from "~/ui/base/DraggableSheet.tsx";

const EMOJI_DICT_URL = "/asset/emoji.json";

const MESSAGE_LENGTH = 5;

const BOOKMARK = [
  { depth: 0, icon: "😀", title: msg`스마일리 및 사람` },
  { depth: 6916, icon: "🐵", title: msg`동물 및 자연` },
  { depth: 8892, icon: "🍇", title: msg`음식 및 음료` },
  { depth: 10608, icon: "🌍", title: msg`여행 및 장소` },
  { depth: 13468, icon: "🎃", title: msg`활동` },
  { depth: 14560, icon: "👓", title: msg`사물` },
  { depth: 17940, icon: "🏧", title: msg`기호` },
  { depth: 20852, icon: "🏁", title: msg`깃발` },
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
      className={`flex h-28 flex-1 items-center justify-center rounded-sm bg-zinc-50 text-5xl ${focus ? "border-b-4 border-black" : ""}`}
      onClick={onClick}
      type="button"
    >
      {emoji}
    </button>
  );
};

export const PokeWithEmojiSheet = createDraggableSheet<{ email: string }>(
  ({ close, context, titleId }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { isMutating, trigger } = usePoke();
    const { t } = useLingui();

    const [input, setInput] = useState<string[]>([]);
    const focusIndex = input.length;

    const [bookmarkPage, setBookmarkPage] = useState(0);

    const { data } = useSWR(EMOJI_DICT_URL, (key) =>
      ky.get(key).json<string[]>(),
    );

    return (
      <div className="py-5" data-testid="이모티콘 찌르기">
        <h1 className="px-5 text-lg font-semibold text-zinc-800" id={titleId}>
          <Trans>이모티콘 찌르기</Trans> 😊
        </h1>
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
          className="mx-5 mt-7 mb-2 flex overflow-x-scroll overflow-y-hidden rounded-full bg-zinc-50"
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
                  <span className="text-xs whitespace-pre text-zinc-700">
                    {t(title)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div
          className="overflow-x-scroll"
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
            <Trans>찌르기</Trans> 👉
          </button>
        </div>
      </div>
    );
  },
);
