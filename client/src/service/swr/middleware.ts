import useSWR, { Key, Middleware } from "swr";
import { SWRConfiguration, SWRResponse } from "swr/_internal";

export type TypedMiddleware<T> = { __type: T } & Middleware;

export const createTypedMiddleware = <T>(middleware: Middleware) =>
  middleware as TypedMiddleware<T>;

type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export const createUseSWRMiddleware = <T extends TypedMiddleware<unknown>[]>(
  ...middlewares: T
) => {
  type TI = UnionToIntersection<
    T[number] extends TypedMiddleware<infer I> ? I : never
  >;
  return <D, E = Error, K extends Key = Key>(
    key: K,
    config?: SWRConfiguration<D, E>,
  ) =>
    useSWR(key, { ...config, use: middlewares }) as SWRResponse<
      D,
      E,
      SWRConfiguration<D, E>
    > &
      TI;
};
