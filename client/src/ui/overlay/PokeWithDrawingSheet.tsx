import { XMarkIcon } from "@heroicons/react/24/outline";
import { Trans } from "@lingui/react/macro";
import { lazy, Suspense, useState } from "react";

import { useDomSize } from "~/hook/base/useDomSize.ts";
import { usePoke } from "~/hook/domain/usePoke.ts";
import { getNormalizedPoints } from "~/service/util.ts";
import { type Line } from "~/ui/base/Canvas.tsx";
import { createDraggableSheet } from "~/ui/base/DraggableSheet.tsx";

const Canvas = lazy(() =>
  import("~/ui/base/Canvas.tsx").then((module) => ({ default: module.Canvas })),
);

const PALETTE = [
  "#53B7F9",
  "#76FB4C",
  "#EA33F4",
  "#DA3832",
  "#EF8532",
  "#FEFC53",
  "#FFFFFF",
];

export const PokeWithDrawingSheet = createDraggableSheet<{ email: string }>(
  ({ close, context: { email }, titleId }) => {
    const {
      domRef,
      size: { height, width },
    } = useDomSize<HTMLDivElement>();

    const [selectedColor, setSelectedColor] = useState(PALETTE[0]);
    const [lines, setLines] = useState<Line[]>([]);

    const { isMutating, trigger } = usePoke();

    return (
      <div className="p-6" data-testid="그림 찌르기">
        <h1 className="text-lg font-semibold text-zinc-800" id={titleId}>
          <Trans>그림 찌르기</Trans> 🎨
        </h1>
        <div className="h-6"></div>
        <div
          className="relative aspect-square w-full"
          data-allow-touch-move-on-stacked-layer
          ref={domRef}
        >
          {lines.length > 0 && (
            <button
              className="absolute top-2 left-2 z-10 rounded-full bg-zinc-800 p-1 text-zinc-300 opacity-80"
              onClick={() => {
                setLines([]);
              }}
              type="button"
            >
              <XMarkIcon className="size-6" />
            </button>
          )}
          <Suspense
            fallback={<div className="size-full rounded-2xl bg-black"></div>}
          >
            <Canvas
              color={selectedColor}
              height={height}
              lines={lines}
              setLines={setLines}
              width={width}
            />
          </Suspense>
        </div>
        <div className="mt-4 flex justify-between">
          {PALETTE.map((color) => (
            <button
              className="flex size-8 items-center justify-center rounded-full"
              key={color}
              onClick={() => setSelectedColor(color)}
              style={{ backgroundColor: color }}
              type="button"
            >
              {color === selectedColor && (
                <div className="animate-jump-in size-2 rounded-full bg-zinc-900"></div>
              )}
            </button>
          ))}
        </div>
        <div className="pt-10">
          <button
            className="h-12 w-full rounded-2xl bg-black font-medium text-white duration-300 active:bg-zinc-300 disabled:bg-zinc-300"
            disabled={lines.length == 0 || isMutating}
            onClick={() =>
              void trigger({
                email,
                payload: {
                  lines: getNormalizedPoints(width)(lines),
                  type: "drawing",
                },
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
