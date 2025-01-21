import { useRef } from "react";
import { Key as SWRKey } from "swr";

import { createTypedMiddleware } from "./middleware";

interface ShouldAnimateContext {
  cachedDataForInitialKey: unknown;
  initialKey: null | SWRKey;
  keyChangedFromInitialKeyAndDataLoaded: boolean;
}
type IsEqualKey<Key extends SWRKey> = (a: Key, b: Key) => boolean;
export const createShouldAnimateMiddleware = <Key extends SWRKey>(
  isEqualKey: IsEqualKey<Key>,
) =>
  createTypedMiddleware<{ shouldAnimate: boolean }>(
    (useSWRNext) => (key, fetcher, config) => {
      const { current: context } = useRef<ShouldAnimateContext>({
        cachedDataForInitialKey: undefined,
        initialKey: null,
        keyChangedFromInitialKeyAndDataLoaded: false,
      });
      const swr = useSWRNext(key, fetcher, config);

      if (key) {
        const isInitialized = context.initialKey !== null;
        if (!isInitialized) {
          context.initialKey = key as Key;
          const hasCacheForInitialKey = swr.data !== undefined;
          if (hasCacheForInitialKey) {
            context.cachedDataForInitialKey = swr.data;
          }
        } else if (
          context.keyChangedFromInitialKeyAndDataLoaded === false &&
          swr.data !== undefined &&
          swr.data !== context.cachedDataForInitialKey &&
          !isEqualKey(context.initialKey as Key, key as Key)
        ) {
          context.keyChangedFromInitialKeyAndDataLoaded = true;
        }
      }

      return {
        ...swr,
        shouldAnimate: !(
          context.cachedDataForInitialKey !== undefined &&
          context.keyChangedFromInitialKeyAndDataLoaded === false
        ),
      };
    },
  );
