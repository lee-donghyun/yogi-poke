import { useCallback, useRef } from "react";
import useSWRInfinite from "swr/infinite";

import { Poke } from "../../service/dataType.ts";
import { useIntersectionObserver } from "../base/useIntersectionObserver.ts";

const POKE_LIST_LIMIT = 20;

export const useRelatedPokeList = () => {
  const { data, error, isLoading, mutate, setSize } = useSWRInfinite<
    Poke[],
    unknown
  >(
    (index, previous) =>
      index === 0 || (previous && previous.length === POKE_LIST_LIMIT)
        ? ["mate/poke", { limit: POKE_LIST_LIMIT, page: index + 1 }]
        : null,
    { revalidateAll: true },
  );
  const loadMore = useCallback(
    () => !isLoading && !error && void setSize((prev) => prev + 1),
    [error, isLoading, setSize],
  );
  const intersectorRef = useIntersectionObserver(loadMore);
  const prevData = useRef(data);

  const isFreshData = (pageIndex: number) =>
    pageIndex + 1 > (prevData.current?.length ?? 0);

  return {
    data,
    error,
    intersectorRef,
    isFreshData,
    mutate,
  };
};
