import { DependencyList, useMemo } from "react";

export const useCreatedAt = (...deps: DependencyList) =>
  useMemo(() => Date.now(), deps);
