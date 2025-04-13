import { Trans } from "@lingui/react/macro";

import { usePoke } from "~/hook/domain/usePoke.ts";
import { createDraggableSheet } from "~/ui/base/DraggableSheet.tsx";
import { PokeWithDrawingSheet } from "~/ui/overlay/PokeWithDrawingSheet.tsx";
import { PokeWithEmojiSheet } from "~/ui/overlay/PokeWithEmojiSheet.tsx";
import { PokeWithGeoLocationSheet } from "~/ui/overlay/PokeWithGeolocationSheet.tsx";
import { Layer, useStackedLayer } from "~/ui/provider/StackedLayerProvider.tsx";

const cx = {
  pokeButton:
    // eslint-disable-next-line lingui/no-unlocalized-strings
    "h-12 rounded-2xl bg-zinc-100 px-4 text-start font-semibold duration-200 active:opacity-60 disabled:opacity-60",
};

export const PokeSheet = createDraggableSheet<{ targetUserEmail: string }>(
  ({ close, context, titleId }) => {
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
        <h1 className="pt-4 text-lg font-semibold text-zinc-800" id={titleId}>
          <Trans>콕! 찌르기</Trans> 👉
        </h1>
        <div className="flex flex-col gap-4 pt-6">
          <button
            className={cx.pokeButton + " text-zinc-900"}
            disabled={isMutating}
            onClick={() => closeAndOpen(PokeWithDrawingSheet)}
          >
            <Trans>그림 찌르기</Trans> 🎨
          </button>
          <button
            className={cx.pokeButton + " text-zinc-900"}
            disabled={isMutating}
            onClick={() => closeAndOpen(PokeWithGeoLocationSheet)}
          >
            <Trans>내 위치 찌르기</Trans> 📍
          </button>
          <button
            className={cx.pokeButton + " text-zinc-900"}
            disabled={isMutating}
            onClick={() => closeAndOpen(PokeWithEmojiSheet)}
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
