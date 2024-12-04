import { startTransition, useDeferredValue, useEffect, useState } from "react";

export const useDebouncedValue = <T>(value: T, timeout: number) => {
  const [state, setState] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        setState(value);
      });
    }, timeout);
    return () => {
      clearTimeout(timer);
    };
  }, [value, timeout]);
  return useDeferredValue(state);
};
