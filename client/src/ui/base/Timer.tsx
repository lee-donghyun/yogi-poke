import dayjs, { Dayjs } from "dayjs";
import { useEffect, useMemo, useRef } from "react";

import { DAY_IN_UNIX, MINUTE_IN_UNIX } from "../page/User.tsx";

const format = "H시간 m분";
const getString = (to: Dayjs) =>
  dayjs.duration(to.diff() + DAY_IN_UNIX - MINUTE_IN_UNIX).format(format);

export const Timer = ({ to }: { to: Dayjs }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const timer = setInterval(() => {
      if (ref.current) {
        ref.current.innerText = getString(to);
      }
    }, MINUTE_IN_UNIX);
    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const render = useMemo(
    () => <span ref={ref}>{getString(to)}</span>,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return render;
};
