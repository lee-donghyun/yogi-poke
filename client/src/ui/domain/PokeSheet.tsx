import { usePoke } from "../../hook/domain/usePoke.ts";
import { PokeWithEmoji } from "../page/Search.PokeWithEmoji.tsx";
import {
  createDraggableSheet,
  useStackedLayer,
} from "../provider/StackedLayerProvider.tsx";

export const PokeSheet = createDraggableSheet<{ targetUserEmail: string }>(
  ({ close, context }) => {
    const { isMutating, trigger } = usePoke();
    const overlay = useStackedLayer();
    return (
      <div className="p-6 pt-0">
        <p className="border-b border-zinc-100 pb-6 pt-4 text-lg font-semibold text-zinc-800">
          콕! 찌르기 👉
        </p>
        <div className="flex flex-col gap-4 pt-6">
          <button
            className="h-12 rounded-2xl bg-zinc-100 px-4 text-start font-semibold text-zinc-900 duration-200 active:opacity-60 disabled:opacity-60"
            disabled={isMutating}
            onClick={() => {
              close();
              setTimeout(() => {
                overlay(PokeWithEmoji, { email: context.targetUserEmail });
              }, 200);
            }}
          >
            이모티콘 찌르기 😊
          </button>
          <button
            className="h-12 rounded-2xl bg-zinc-100 px-4 text-start font-semibold duration-200 active:opacity-60 disabled:opacity-60"
            disabled={isMutating}
            onClick={() => {
              void trigger({
                email: context.targetUserEmail,
                payload: { type: "normal" },
              }).finally(() => close());
            }}
          >
            바로 콕! 찌르기 👉
          </button>
        </div>
      </div>
    );
  },
);
