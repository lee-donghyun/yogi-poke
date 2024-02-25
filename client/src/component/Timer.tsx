import dayjs, { Dayjs } from "dayjs";
import { useEffect, useMemo, useRef } from "react";

import { DAY_IN_UNIX, MINUTE_IN_UNIX } from "../page/User";

export const Timer = ({ to }: { to: Dayjs }) => {
  const format = "H시간 m분";
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const timer = setInterval(() => {
      if (ref.current) {
        ref.current.innerText = dayjs
          .duration(to.diff() + DAY_IN_UNIX)
          .format(format);
      }
    }, MINUTE_IN_UNIX);
    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const render = useMemo(
    () => (
      <span ref={ref}>
        {dayjs.duration(to.diff() + DAY_IN_UNIX).format(format)}
      </span>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return render;
};
