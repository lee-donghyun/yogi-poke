import { lazy, Suspense } from "react";

import { useDomSize } from "~/hook/base/useDomSize";
import { getDenormalizedPoints } from "~/service/util";
import { type Line } from "~/ui/base/Canvas";
import { createDraggableSheet } from "~/ui/base/DraggableSheet";

const CanvasRenderer = lazy(() =>
  import("~/ui/base/CanvasRenderer").then((module) => ({
    default: module.CanvasRenderer,
  })),
);

export const ShowDrawingSheet = createDraggableSheet<{
  lines: Line[];
  title: string;
}>(({ context, titleId }) => {
  const {
    domRef,
    size: { height, width },
  } = useDomSize<HTMLDivElement>();

  return (
    <div className="p-6" data-testid="그림 보기">
      <h1 className="text-lg font-semibold text-zinc-800" id={titleId}>
        {context.title}
      </h1>
      <div className="h-6"></div>
      <div className="aspect-square w-full" ref={domRef}>
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
