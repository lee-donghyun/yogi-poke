import { createResource, ResourceReturn } from "solid-js";

const cache = new Map<string, unknown>();

export const useResource = <T>(key: string, fetcher: () => Promise<T>) => {
  if (cache.has(key)) {
    return cache.get(key) as ResourceReturn<T, unknown>;
  }
  return cache.set(key, createResource(fetcher)).get(key) as ResourceReturn<
    T,
    unknown
  >;
};
