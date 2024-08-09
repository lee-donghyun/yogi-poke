import { useLayoutEffect, useRef, useState } from "react";

export const useDomSize = <T extends HTMLElement>() => {
  const domRef = useRef<T>(null);
  const [size, setSize] = useState<{ height: number; width: number }>({
    height: 0,
    width: 0,
  });
  useLayoutEffect(() => {
    if (domRef.current) {
      const observer = new ResizeObserver((entries) => {
        const { height, width } = entries[0].contentRect;
        setSize({ height, width });
      });
      observer.observe(domRef.current);
      return () => observer.disconnect();
    }
  }, []);
  return { domRef, size };
};
