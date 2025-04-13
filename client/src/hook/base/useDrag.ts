import { useEffect, useState } from "react";

import { useLiveRef } from "~/hook/base/useLiveRef";

interface Props {
  onDrag?: (e: PointerEvent) => void;
  onEnd?: (e: PointerEvent) => void;
  onStart?: (e: PointerEvent) => void;
}

export const useDrag = <T extends HTMLElement>(props: Props) => {
  const [isDragging, setIsDragging] = useState(false);

  const liveProps = useLiveRef(props);

  const onPointerDown = (e: React.PointerEvent<T>) => {
    setIsDragging(true);
    liveProps.current.onStart?.(e.nativeEvent);
  };

  useEffect(() => {
    if (isDragging) {
      const onPointerMove = (e: PointerEvent) => {
        liveProps.current.onDrag?.(e);
      };
      const onPointerUp = (e: PointerEvent) => {
        setIsDragging(false);
        liveProps.current.onEnd?.(e);
      };
      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
      return () => {
        document.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerup", onPointerUp);
      };
    }
  }, [isDragging, liveProps]);

  return {
    onPointerDown,
  };
};
