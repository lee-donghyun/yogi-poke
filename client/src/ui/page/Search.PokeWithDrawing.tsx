import { lazy, Suspense } from "react";

import { useDomSize } from "../../hook/base/useDomSize";
import { createDraggableSheet } from "../provider/StackedLayerProvider";

const Canvas = lazy(() =>
  import("../base/Canvas").then((module) => ({ default: module.Canvas })),
);

export const PokeWithDrawing = createDraggableSheet<{ email: string }>(() => {
  const {
    domRef,
    size: { height, width },
  } = useDomSize<HTMLDivElement>();

  return (
    <div className="p-6">
      <p className="text-lg font-semibold text-zinc-800">그림 찌르기 🎨</p>
      <div className="h-6"></div>
      <div
        className="aspect-square w-full"
        data-allow-touch-move-on-stacked-layer
        ref={domRef}
      >
        <Suspense
          fallback={<div className="size-full rounded-2xl bg-black"></div>}
        >
          <Canvas height={height} width={width} />
        </Suspense>
      </div>
    </div>
  );
});
