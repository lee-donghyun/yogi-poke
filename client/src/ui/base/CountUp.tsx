import { useLayoutEffect, useMemo, useRef } from "react";

const TIMEOUT = 50;

export const CountUp = ({
  duration,
  from,
  to,
}: {
  duration: number;
  from: number;
  to: number;
}) => {
  const fromValue = useRef(from);
  const prevValue = useRef(from);
  const ref = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const diff = to - fromValue.current;
    const tick = diff / (duration / TIMEOUT);
    const timer = setInterval(() => {
      const nextValue = Math.ceil(prevValue.current + tick);
      if (nextValue < to) {
        if (ref.current) {
          ref.current.innerText = nextValue.toLocaleString();
        }
        prevValue.current = nextValue;
      } else {
        if (ref.current) {
          ref.current.innerText = to.toLocaleString();
        }
        clearInterval(timer);
      }
    }, TIMEOUT);
    return () => {
      clearInterval(timer);
    };
  }, [duration, to]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const render = useMemo(() => <span ref={ref}>{from}</span>, []);
  return render;
};
