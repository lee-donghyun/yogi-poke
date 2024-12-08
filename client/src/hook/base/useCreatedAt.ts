import { useMemo } from "react";

// eslint-disable-next-line react-hooks/exhaustive-deps
export const useCreatedAt = (dep: unknown) => useMemo(() => Date.now(), [dep]);
