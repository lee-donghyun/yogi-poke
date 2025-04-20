import { useEffect, useRef } from "react";

import { useLiveRef } from "~/hook/base/useLiveRef";

export const useIntersectionObserver = <T extends HTMLElement = HTMLDivElement>(
  onObserve: () => unknown,
) => {
  const intersectorRef = useRef<T>(null);
  const onObserveRef = useLiveRef(onObserve);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        onObserveRef.current();
      }
    });
    if (intersectorRef.current) {
      observer.observe(intersectorRef.current);
      return () => {
        observer.disconnect();
      };
    }
  }, [onObserveRef]);

  return intersectorRef;
};
