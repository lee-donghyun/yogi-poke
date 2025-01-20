import { createdAt } from "../util";
import { createTypedMiddleware } from "./middleware";

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
