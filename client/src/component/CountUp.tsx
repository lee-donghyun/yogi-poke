import { useLayoutEffect, useRef } from "react";

const TIMEOUT = 50;

export const CountUp = ({
  duration,
  from,
  to,
}: {
  from: number;
  to: number;
  duration: number;
}) => {
  const fromValue = useRef(from);
  const prevValue = useRef(from);
  const ref = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const diff = to - fromValue.current;
    const tick = diff / (duration / TIMEOUT);
    const timer = setInterval(() => {
      const nextValue = Math.round(prevValue.current + tick);
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
  return <span ref={ref}>{ref.current?.innerText}</span>;
};
