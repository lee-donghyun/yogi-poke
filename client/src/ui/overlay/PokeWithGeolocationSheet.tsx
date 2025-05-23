import { Trans } from "@lingui/react/macro";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { useDomSize } from "~/hook/base/useDomSize";
import {
  GeolocationConsumer,
  useGeolocation,
} from "~/hook/base/useGeolocation";
import { usePoke } from "~/hook/domain/usePoke";
import { createDraggableSheet } from "~/ui/base/DraggableSheet";

const Map = lazy(() =>
  import("~/ui/base/Map").then((module) => ({ default: module.Map })),
);

export const PokeWithGeoLocationSheet = createDraggableSheet<{ email: string }>(
  ({ close, context: { email }, titleId }) => {
    const {
      domRef,
      size: { height, width },
    } = useDomSize<HTMLDivElement>();
    const { isMutating, trigger } = usePoke();
    const { data, isLoading } = useGeolocation();

    return (
      <div className="p-6" data-testid="내 위치 찌르기">
        <h1 className="text-lg font-semibold text-zinc-800" id={titleId}>
          <Trans>내 위치 찌르기</Trans> 📍
        </h1>
        <div className="h-6"></div>
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
              {/* 내 위치 로드 중 suspense 의 fallback 을 보야주기 위해 사용한다. */}
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
            disabled={isMutating || isLoading}
            onClick={() =>
              data &&
              void trigger({
                email,
                payload: {
                  position: {
                    latitude: data.coords.latitude,
                    longitude: data.coords.longitude,
                  },
                  type: "geolocation",
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
