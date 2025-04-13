import { useLayoutEffect, useRef } from "react";

export const useLiveRef = <T>(value: T) => {
  const ref = useRef(value);
  useLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
};
