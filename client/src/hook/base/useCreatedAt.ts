import { DependencyList, useMemo } from "react";

export const useCreatedAt = (...deps: DependencyList) =>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => Date.now(), deps);
