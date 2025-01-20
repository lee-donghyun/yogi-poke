import { useMemo } from "react";
import { Middleware, Key as SWRKey } from "swr";

import { createdAt, withContext } from "./util";

type TypedMiddleware<T> = { __type: T } & Middleware;

interface CombineMiddlewares {
  <A>(a: TypedMiddleware<A>): TypedMiddleware<A>[];
  <A, B>(
    a: TypedMiddleware<A>,
    b: TypedMiddleware<B>,
  ): TypedMiddleware<A & B>[];
  <A, B, C>(
    a: TypedMiddleware<A>,
    b: TypedMiddleware<B>,
    c: TypedMiddleware<C>,
  ): TypedMiddleware<A & B & C>[];
}

/**
 * combineMiddlewares의 반환값을 통해 useSWR의 반환값을 추론합니다.
 * @example
 * const use = combineMiddlewares(
    useShouldAnimateMiddleware(isEqualKey),
    dataUpdatedAtMiddleware,
  );
  const { dataUpdatedAt, shouldAnimate } = useSWR(
    ["user"], { use },
  ) as InferMiddlewareType<typeof use> & SWRResponse<User[]>;
 */
export type InferMiddlewareType<T> = T extends TypedMiddleware<infer U>[]
  ? U
  : never;

const createTypedMiddleware = <T>(middleware: Middleware) =>
  middleware as TypedMiddleware<T>;
export const combineMiddlewares: CombineMiddlewares = (
  ...middlewares: TypedMiddleware<unknown>[]
) => middlewares;

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

export const dataUpdatedAtMiddleware = createTypedMiddleware<{
  dataUpdatedAt: number;
}>((useSWRNext) => (key, fetcher, config) => {
  const swr = useSWRNext(key, fetcher, config);
  const dataUpdatedAt = createdAt(swr.data as WeakKey);
  return {
    ...swr,
    dataUpdatedAt,
  };
});
