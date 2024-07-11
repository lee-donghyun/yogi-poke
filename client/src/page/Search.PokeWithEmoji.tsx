import axios from "axios";
import { useState } from "react";
import useSWR from "swr";

import { createDraggableSheet } from "../component/StackedLayerProvider";
import { usePoke } from "../hook/usePoke";

const EMOJI_DICT_URL = "/asset/emoji.json";

const MESSAGE_LENGTH = 5;

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
    const [input, setInput] = useState<string[]>([]);
    const focusIndex = input.length;
    const { data } = useSWR(EMOJI_DICT_URL, (key) =>
      axios.get<string[]>(key).then((res) => res.data),
    );
    const { trigger, isMutating } = usePoke();

    return (
      <div className="py-5">
        <p className="px-5 text-lg font-semibold text-zinc-800">
          이모티콘 찌르기 😊
        </p>
        <div className="flex gap-2 px-5 pt-5">
          {Array.from({ length: MESSAGE_LENGTH }).map((_, index) => (
            <Emoji
              key={`${input[index]}-${index}`}
              emoji={input[index]}
              focus={index == focusIndex}
              onClick={() => setInput((p) => p.slice(0, index))}
            />
          ))}
        </div>
        <div
          data-allow-touch-move-on-stacked-layer
          className="overflow-x-scroll pt-7"
        >
          <div className="grid grid-flow-col grid-rows-5 gap-1 px-5 text-3xl">
            {data?.map((emoji, i) => (
              <button
                key={i}
                className="size-11 rounded-full duration-100 active:scale-90 active:opacity-70"
                type="button"
                onClick={() => {
                  setInput((p) => [...p, emoji].slice(-MESSAGE_LENGTH));
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
        <div className="px-5 pt-10">
          <button
            className="w-full rounded-full bg-black p-4 text-white duration-300 active:bg-zinc-300 disabled:bg-zinc-300"
            disabled={input.length !== MESSAGE_LENGTH || isMutating}
            type="button"
            onClick={() =>
              void trigger({
                email: context.email,
                payload: { type: "emoji", message: input.join("") },
              }).then(close)
            }
          >
            찌르기 👉
          </button>
        </div>
      </div>
    );
  },
);
