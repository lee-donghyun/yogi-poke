import { useMemo } from "react";
import { Key as SWRKey } from "swr";

import { withContext } from "../util";
import { createTypedMiddleware, TypedMiddleware } from "./middleware";

interface ShouldAnimateContext {
  cachedDataForInitialKey: unknown;
  initialKey: null | SWRKey;
  keyChangedFromInitialKeyAndDataLoaded: boolean;
}
type IsEqualKey<Key extends SWRKey> = (a: Key, b: Key) => boolean;
const createShouldAnimateMiddleware = <Key extends SWRKey>(
  isEqualKey: IsEqualKey<Key>,
) =>
  withContext<
    ShouldAnimateContext,
    TypedMiddleware<{ shouldAnimate: boolean }>
  >(
    (context) =>
      createTypedMiddleware((useSWRNext) => (key, fetcher, config) => {
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
      }),
    {
      cachedDataForInitialKey: undefined,
      initialKey: null,
      keyChangedFromInitialKeyAndDataLoaded: false,
    },
  );

export const useShouldAnimateMiddleware = <Key extends SWRKey>(
  isEqualKey: IsEqualKey<Key>,
) => useMemo(() => createShouldAnimateMiddleware(isEqualKey), [isEqualKey]);
