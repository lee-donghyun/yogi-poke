import { useEffect, useState, useTransition } from "react";

export const useDebouncedValue = <T>(
  value: T,
  timeout: number,
  options: {
    strategy?: "latest" | "stable";
  } = {
    strategy: "stable",
  },
) => {
  const [, startTransition] = useTransition();
  const [state, setState] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        setState(value);
      });
    }, timeout);
    return () => {
      clearTimeout(timer);
      if (options.strategy === "latest") {
        setState(value);
      }
    };
  }, [value, timeout, options.strategy]);
  return state;
};
