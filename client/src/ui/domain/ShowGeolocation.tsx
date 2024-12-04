import { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { useDomSize } from "../../hook/base/useDomSize";
import { createDraggableSheet } from "../provider/StackedLayerProvider";

const Map = lazy(() =>
  import("../base/Map").then((module) => ({ default: module.Map })),
);

export const ShowGeolocation = createDraggableSheet<{
  position: { latitude: number; longitude: number };
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
            {/*  flash of unstyled content (FOUC) 방지를 위해 height > 0 조건 추가 */}
            {height > 0 && (
              <Map
                height={height}
                position={context.position}
                showCurrentPosition
                width={width}
              />
            )}
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
});
