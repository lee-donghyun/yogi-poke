import { Middleware } from "swr";

export type TypedMiddleware<T> = { __type: T } & Middleware;

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
export const combineMiddlewares: CombineMiddlewares = (
  ...middlewares: TypedMiddleware<unknown>[]
) => middlewares;

export const createTypedMiddleware = <T>(middleware: Middleware) =>
  middleware as TypedMiddleware<T>;
