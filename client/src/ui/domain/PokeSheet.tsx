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
      <div className="p-5">
        <p className="text-lg font-semibold text-zinc-800">콕! 찌르기 👉</p>
        <div className="flex gap-2 pt-12">
          <button
            className="flex-1 rounded-full bg-zinc-50 p-3 duration-200 disabled:opacity-60"
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
            className="flex-1 rounded-full bg-zinc-50 p-3 duration-200 disabled:opacity-60"
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
