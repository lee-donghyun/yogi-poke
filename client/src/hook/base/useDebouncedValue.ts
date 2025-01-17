import { useEffect, useState, useTransition } from "react";

export const useDebouncedValue = <T>(value: T, timeout: number) => {
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
    };
  }, [value, timeout]);
  return state;
};
