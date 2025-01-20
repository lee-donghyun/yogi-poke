import { useMemo } from "react";
import { Key as SWRKey } from "swr";

import { withContext } from "../util";
import { createTypedMiddleware, TypedMiddleware } from "./middleware";

interface ShouldAnimateContext {
  hasCacheForInitialKey: boolean;
  initialKey: null | SWRKey;
  keyChanged: boolean;
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
        const isInitialized = context.initialKey !== null;
        const swr = useSWRNext(key, fetcher, config);

        if (!isInitialized) {
          context.initialKey = key as Key;
          context.hasCacheForInitialKey = swr.data !== undefined;
        } else if (
          !context.keyChanged &&
          !isEqualKey(key as Key, context.initialKey as Key)
        ) {
          context.keyChanged = true;
        }

        return {
          ...swr,
          /**
           * 캐시된 데이터가 있으면서 첫 마운트일때 애니메이션 없이 렌더링
           */
          shouldAnimate: !(
            context.hasCacheForInitialKey && !context.keyChanged
          ),
        };
      }),
    {
      hasCacheForInitialKey: false,
      initialKey: null,
      keyChanged: false,
    },
  );

export const useShouldAnimateMiddleware = <Key extends SWRKey>(
  isEqualKey: IsEqualKey<Key>,
) => useMemo(() => createShouldAnimateMiddleware(isEqualKey), [isEqualKey]);
