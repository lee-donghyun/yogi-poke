import { createTypedMiddleware } from "~/service/swr/middleware";
import { createdAt } from "~/service/util";

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
