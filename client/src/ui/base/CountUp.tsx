import { useEffect, useRef, useState } from "react";

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

  const [content, setContent] = useState(from.toLocaleString());

  useEffect(() => {
    const diff = to - fromValue.current;
    const tick = diff / (duration / TIMEOUT);
    const timer = setInterval(() => {
      const nextValue = Math.ceil(prevValue.current + tick);
      if (nextValue < to) {
        setContent(nextValue.toLocaleString());
        prevValue.current = nextValue;
      } else {
        setContent(to.toLocaleString());
        clearInterval(timer);
      }
    }, TIMEOUT);
    return () => {
      clearInterval(timer);
    };
  }, [duration, to]);

  return <span>{content}</span>;
};
