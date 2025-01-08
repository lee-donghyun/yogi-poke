import { Trans } from "@lingui/react/macro";

import { usePoke } from "../../hook/domain/usePoke.ts";
import {
  createDraggableSheet,
  Layer,
  useStackedLayer,
} from "../provider/StackedLayerProvider.tsx";
import { PokeWithDrawing } from "./PokeWithDrawing.tsx";
import { PokeWithEmoji } from "./PokeWithEmoji.tsx";
import { PokeWithGeoLocation } from "./PokeWithGeolocation.tsx";

const cx = {
  pokeButton:
    // eslint-disable-next-line lingui/no-unlocalized-strings
    "h-12 rounded-2xl bg-zinc-100 px-4 text-start font-semibold duration-200 active:opacity-60 disabled:opacity-60",
};

export const PokeSheet = createDraggableSheet<{ targetUserEmail: string }>(
  ({ close, context }) => {
    const { isMutating, trigger } = usePoke();
    const overlay = useStackedLayer();

    const closeAndOpen = (Sheet: Layer<{ email: string }>) => {
      close();
      setTimeout(() => overlay(Sheet, { email: context.targetUserEmail }), 200);
    };

    const normalPoke = () => {
      void trigger({
        email: context.targetUserEmail,
        payload: { type: "normal" },
      }).finally(() => close());
    };

    return (
      <div className="p-6 pt-0">
        <p className="border-b border-zinc-100 pb-6 pt-4 text-lg font-semibold text-zinc-800">
          <Trans>콕! 찌르기</Trans> 👉
        </p>
        <div className="flex flex-col gap-4 pt-6">
          <button
            className={cx.pokeButton + " text-zinc-900"}
            disabled={isMutating}
            onClick={() => closeAndOpen(PokeWithDrawing)}
          >
            <Trans>그림 찌르기</Trans> 🎨
          </button>
          <button
            className={cx.pokeButton + " text-zinc-900"}
            disabled={isMutating}
            onClick={() => closeAndOpen(PokeWithGeoLocation)}
          >
            <Trans>내 위치 찌르기</Trans> 📍
          </button>
          <button
            className={cx.pokeButton + " text-zinc-900"}
            disabled={isMutating}
            onClick={() => closeAndOpen(PokeWithEmoji)}
          >
            <Trans>이모티콘 찌르기</Trans> 😊
          </button>
          <button
            className={cx.pokeButton}
            disabled={isMutating}
            onClick={normalPoke}
          >
            <Trans>바로 콕! 찌르기</Trans> 👉
          </button>
        </div>
      </div>
    );
  },
);
