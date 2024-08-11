import {
  MicrophoneIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

import { usePoke } from "../../hook/domain/usePoke";
import { createDraggableSheet } from "../provider/StackedLayerProvider";

const cx = {
  actionButton:
    "flex animate-jump-in items-center justify-center rounded-full bg-zinc-100 p-2 text-zinc-800 animate-duration-100",
};

export const PokeWithVoice = createDraggableSheet<{ email: string }>(
  ({ close, context: { email } }) => {
    const { isMutating, trigger } = usePoke();
    const [isRecording, setIsRecording] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    return (
      <div className="p-6">
        <p className="text-lg font-semibold text-zinc-800">음성 찌르기 🎤</p>
        <div className="h-6"></div>
        <div
          className={`${isRecording ? "bg-red-50" : "bg-zinc-50"} flex items-center gap-2 rounded-full p-3 duration-200`}
        >
          {!isRecording && (
            <button
              className={cx.actionButton}
              onClick={() => setIsRecording(true)}
              type="button"
            >
              <MicrophoneIcon className="size-5 text-red-500" />
            </button>
          )}
          {!isRecording && isPlaying && (
            <button className={cx.actionButton} type="button">
              <PauseIcon className="size-5" />
            </button>
          )}
          {!isRecording && !isPlaying && (
            <button className={cx.actionButton} type="button">
              <PlayIcon className="size-5" />
            </button>
          )}
          <div className="flex-1"></div>
          <button
            className={`${isRecording ? "bg-red-200" : "bg-black"} rounded-full p-2.5 duration-200 active:opacity-60`}
            onClick={() => {
              if (isRecording) {
                setIsRecording(false);
                return;
              }
              close();
            }}
          >
            {isRecording ? (
              <div className="size-4 rounded-sm bg-red-500"></div>
            ) : (
              <div className="size-4 leading-4">👉</div>
            )}
          </button>
        </div>
      </div>
    );
  },
);
