import { useCallback, useRef } from "react";
import useSWRInfinite from "swr/infinite";

import { Poke } from "../../service/dataType.ts";
import { useIntersectionObserver } from "../base/useIntersectionObserver.ts";

const POKE_LIST_LIMIT = 20;

export const useRelatedPokeList = () => {
  const { data, setSize, error, isLoading, mutate } = useSWRInfinite<
    Poke[],
    unknown
  >((index, previous) =>
    index === 0 || (previous && previous.length === POKE_LIST_LIMIT)
      ? ["/mate/poke", { limit: POKE_LIST_LIMIT, page: index + 1 }]
      : null,
  );
  const loadMore = useCallback(
    () => !isLoading && !error && void setSize((prev) => prev + 1),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, setSize, !!error],
  );
  const intersectorRef = useIntersectionObserver(loadMore);
  const prevData = useRef(data);

  const isFreshData = (pageIndex: number) =>
    pageIndex + 1 > (prevData.current?.length ?? 0);

  return {
    data,
    error,
    mutate,
    intersectorRef,
    isFreshData,
  };
};
