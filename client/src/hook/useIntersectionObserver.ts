import { useEffect, useRef } from "react";

export const useIntersectionObserver = (onObserve: () => unknown) => {
  const intersectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        onObserve();
      }
    });
    if (intersectorRef.current) {
      observer.observe(intersectorRef.current);
      return () => {
        observer.disconnect();
      };
    }
  }, [onObserve]);

  return intersectorRef;
};
