import { Trans } from "@lingui/react/macro";
import { lazy, Suspense, useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { useDomSize } from "~/hook/base/useDomSize";
import { useGeolocation } from "~/hook/base/useGeolocation";
import { getDistance } from "~/service/util";
import { CountUp } from "~/ui/base/CountUp";
import { createDraggableSheet } from "~/ui/base/DraggableSheet";

const Map = lazy(() =>
  import("~/ui/base/Map").then((module) => ({ default: module.Map })),
);

export const ShowGeolocationSheet = createDraggableSheet<{
  position: { latitude: number; longitude: number };
  title: string;
}>(({ context, titleId }) => {
  const {
    domRef,
    size: { height, width },
  } = useDomSize<HTMLDivElement>();

  const { data } = useGeolocation();

  const distance = useMemo(
    () =>
      data ? Math.ceil(getDistance(data.coords, context.position) * 1000) : 0,
    [data, context.position],
  );

  return (
    <div className="p-6 pt-2.5" data-testid="위치 보기">
      <h1 className="text-lg font-semibold text-zinc-800" id={titleId}>
        {context.title}
      </h1>
      <p className="pt-3 pb-6 text-sm text-zinc-400">
        <Trans>
          나와의 거리: <CountUp duration={1500} from={0} to={distance} />m
        </Trans>
      </p>
      <div
        className="relative aspect-square w-full overflow-hidden rounded-2xl"
        ref={domRef}
      >
        <ErrorBoundary
          fallback={
            <div className="size-full bg-zinc-100 p-5 text-zinc-700">
              <Trans>사용할 수 없는 기기입니다.</Trans>
            </div>
          }
        >
          <Suspense
            fallback={
              <div className="size-full animate-pulse bg-zinc-100"></div>
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
