import { lazy, Suspense } from "react";

import { useDomSize } from "../../hook/base/useDomSize";
import { getDenormalizedPoints } from "../../service/util";
import { type Line } from "../base/Canvas";
import { createDraggableSheet } from "../base/DraggableSheet";

const CanvasRenderer = lazy(() =>
  import("../base/CanvasRenderer").then((module) => ({
    default: module.CanvasRenderer,
  })),
);

export const ShowDrawing = createDraggableSheet<{
  lines: Line[];
  title: string;
}>(({ context }) => {
  const {
    domRef,
    size: { height, width },
  } = useDomSize<HTMLDivElement>();

  return (
    <div className="p-6">
      <p className="text-lg font-semibold text-zinc-800">{context.title}</p>
      <div className="h-6"></div>
      <div
        className="aspect-square w-full"
        data-allow-touch-move-on-stacked-layer
        ref={domRef}
      >
        <Suspense
          fallback={<div className="size-full rounded-2xl bg-black"></div>}
        >
          <CanvasRenderer
            height={height}
            lines={getDenormalizedPoints(width)(context.lines)}
            width={width}
          />
        </Suspense>
      </div>
    </div>
  );
});
