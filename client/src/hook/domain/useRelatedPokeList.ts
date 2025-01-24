import { useCallback, useRef } from "react";
import { mutate } from "swr";
import useSWRInfinite, { unstable_serialize } from "swr/infinite";

import { useIntersectionObserver } from "~/hook/base/useIntersectionObserver.ts";
import { Poke } from "~/service/dataType.ts";

const POKE_LIST_LIMIT = 20;

const SWR_KEY_MATE_POKE = "mate/poke";

/**
 * useRelatedPokeList().mutate 를 사용하지 못하는 환경에서 사용한다.
 * useRelatedPokeList()가 mount 되어있지 않은 상태에서는 즉시 데이터를 요청하지 않는다. 하지만 해당 시나리오에서는 데이터를 가져오지 않아도 된다고 판단.
 * 즉시 리스트 전체는 가져오지 않고, 첫 페이지만 가져온다. swr 은 첫 페이지가 바뀐 경우 연쇄적으로 요청을 하므로, 첫 페이지만 가져오는 것으로 충분하다.
 * @see https://swr.vercel.app/docs/mutation#global-mutate
 * @see https://swr.vercel.app/docs/pagination.en-US#global-mutate-with-useswrinfinite
 */
export const mutateRelatedPokeList = () =>
  mutate(
    unstable_serialize((index) => [
      SWR_KEY_MATE_POKE,
      { limit: POKE_LIST_LIMIT, page: index + 1 },
    ]),
  );

export const useRelatedPokeList = () => {
  const { data, error, isLoading, mutate, setSize } = useSWRInfinite<
    Poke[],
    unknown
  >(
    (index, previous) =>
      index === 0 || (previous && previous.length === POKE_LIST_LIMIT)
        ? [SWR_KEY_MATE_POKE, { limit: POKE_LIST_LIMIT, page: index + 1 }]
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
