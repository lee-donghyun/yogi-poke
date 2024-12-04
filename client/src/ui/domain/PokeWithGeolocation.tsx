import { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { useDomSize } from "../../hook/base/useDomSize";
import { GeolocationConsumer } from "../../hook/base/useGeolocation";
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
          <ErrorBoundary
            fallback={
              <div className="size-full rounded-2xl bg-zinc-100 p-5 text-zinc-700">
                사용할 수 없는 기기입니다.
              </div>
            }
          >
            <Suspense
              fallback={
                <div className="size-full animate-pulse rounded-2xl bg-zinc-100"></div>
              }
            >
              <GeolocationConsumer>
                {(position) =>
                  // flash of unstyled content (FOUC) 방지를 위해 height > 0 조건 추가
                  height > 0 &&
                  position && (
                    <Map
                      height={height}
                      position={position.coords}
                      width={width}
                    />
                  )
                }
              </GeolocationConsumer>
            </Suspense>
          </ErrorBoundary>
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
