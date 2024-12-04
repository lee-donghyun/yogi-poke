import { lazy, Suspense } from "react";

import { useDomSize } from "../../hook/base/useDomSize";
import { usePoke } from "../../hook/domain/usePoke";
import { createDraggableSheet } from "../provider/StackedLayerProvider";

const Map = lazy(() =>
  import("../base/Map").then((module) => ({ default: module.Map })),
);

export const PokeWithGeoLocation = createDraggableSheet<{ email: string }>(
  ({ close, context: { email } }) => {
    const {
      domRef,
      size: { height, width },
    } = useDomSize<HTMLDivElement>();
    const { isMutating, trigger } = usePoke();

    return (
      <div className="p-6">
        <p className="text-lg font-semibold text-zinc-800">내 위치 찌르기 📍</p>
        <div className="h-6"></div>
        <div
          className="relative aspect-square w-full overflow-hidden rounded-2xl"
          data-allow-touch-move-on-stacked-layer
          ref={domRef}
        >
          <Suspense
            fallback={
              <div className="size-full animate-pulse rounded-2xl bg-zinc-100"></div>
            }
          >
            {height > 0 && <Map height={height} width={width} />}
          </Suspense>
        </div>
        <div className="pt-10">
          <button
            className="h-12 w-full rounded-2xl bg-black font-medium text-white duration-300 active:bg-zinc-300 disabled:bg-zinc-300"
            disabled={isMutating}
            onClick={() =>
              void trigger({
                email,
                payload: { type: "normal" },
              }).then(close)
            }
            type="button"
          >
            찌르기 👉
          </button>
        </div>
      </div>
    );
  },
);
