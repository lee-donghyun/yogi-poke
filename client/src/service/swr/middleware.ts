import useSWR, { Key, Middleware } from "swr";
import { Fetcher, SWRConfiguration, SWRResponse } from "swr/_internal";

export type TypedMiddleware<T> = { __type: T } & Middleware;

type ArgumentsTuple = readonly [unknown, ...unknown[]];
type MergeMiddleware<T extends TypedMiddleware<unknown>[]> = MergeProperties<
  T[number] extends TypedMiddleware<infer P> ? P : never
>;
type MergeProperties<T> = {
  [K in T as keyof K]: K[keyof K];
};
type StrictKey = (() => StrictTupleKey) | StrictTupleKey;

type StrictTupleKey = ArgumentsTuple | false | null | undefined;
type SWRConfigurationWithOptionalFallback<Options> = Options extends Required<
  Pick<SWRConfiguration, "fallbackData">
> &
  SWRConfiguration
  ? Omit<Options, "fallbackData"> & Pick<Partial<Options>, "fallbackData">
  : Options;

type UseSWRMiddleware = <
  Data = unknown,
  Middewares extends TypedMiddleware<unknown>[] = TypedMiddleware<unknown>[],
  SWRKey extends Key = StrictKey,
  Error = unknown,
  SWROptions extends
    | ({ use: Middewares } & Omit<
        SWRConfiguration<Data, Error, Fetcher<Data, SWRKey>>,
        "use"
      >)
    | undefined =
    | ({ use: Middewares } & Omit<
        SWRConfiguration<Data, Error, Fetcher<Data, SWRKey>>,
        "use"
      >)
    | undefined,
>(
  key: SWRKey,
  config: SWRConfigurationWithOptionalFallback<SWROptions>,
) => MergeMiddleware<Middewares> & SWRResponse<Data, Error, SWROptions>;

export const createTypedMiddleware = <T>(middleware: Middleware) =>
  middleware as TypedMiddleware<T>;
export const useSWRMiddleware = useSWR as UseSWRMiddleware;
