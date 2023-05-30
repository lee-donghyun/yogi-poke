import { useEffect, useState } from "react";

export const useDebouncedValue = <T>(value: T, timeout: number) => {
  const [state, setState] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      setState(value);
    }, timeout);
    return () => {
      clearTimeout(timer);
    };
  }, [value, timeout]);
  return state;
};
