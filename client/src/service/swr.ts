import { useMemo } from "react";
import { Middleware, Key as SWRKey } from "swr";

import { createdAt, withContext } from "./util";

interface ShouldAnimateContext {
  hasCacheForInitialKey: boolean;
  initialKey: null | SWRKey;
  keyChanged: boolean;
}

interface ShouldAnimateOptions<Key extends SWRKey> {
  isEqualKey: (a: Key, b: Key) => boolean;
}

const createShouldAnimateMiddleware = <Key extends SWRKey>(
  options: ShouldAnimateOptions<Key>,
) =>
  withContext<ShouldAnimateContext, Middleware>(
    (context) => (useSWRNext) => (key, fetcher, config) => {
      const isInitialized = context.initialKey !== null;
      const swr = useSWRNext(key, fetcher, config);

      if (!isInitialized) {
        context.initialKey = key as Key;
        context.hasCacheForInitialKey = swr.data !== undefined;
      } else if (
        !context.keyChanged &&
        !options.isEqualKey(key as Key, context.initialKey as Key)
      ) {
        context.keyChanged = true;
      }

      return {
        ...swr,
        /**
         * 캐시된 데이터가 있으면서 첫 마운트일때 애니메이션 없이 렌더링
         */
        shouldAnimate: !(context.hasCacheForInitialKey && !context.keyChanged),
      };
    },
    {
      hasCacheForInitialKey: false,
      initialKey: null,
      keyChanged: false,
    },
  );

/**
 *
 * @param options 컴포넌트 바깥에서 선언하여 참조 업데이트를 방지해야 함
 * @returns
 */
export const useShouldAnimateMiddleware = <Key extends SWRKey>(
  options: ShouldAnimateOptions<Key>,
) => useMemo(() => createShouldAnimateMiddleware(options), [options]);

export const dataUpdatedAtMiddleware: Middleware =
  (useSWRNext) => (key, fetcher, config) => {
    const swr = useSWRNext(key, fetcher, config);
    const dataUpdatedAt = createdAt(swr.data as WeakKey);
    return {
      ...swr,
      dataUpdatedAt,
    };
  };
