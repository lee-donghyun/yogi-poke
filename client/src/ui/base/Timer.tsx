import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";

import { DAY_IN_UNIX, MINUTE_IN_UNIX } from "../../service/const";

const FORMAT = "H시간 m분";
const getString = (to: Dayjs) =>
  dayjs.duration(to.diff() + DAY_IN_UNIX - MINUTE_IN_UNIX).format(FORMAT);

export const Timer = ({ to }: { to: Dayjs }) => {
  const [content, setContent] = useState(() => getString(to));

  useEffect(() => {
    const timer = setInterval(() => {
      setContent(getString(to));
    }, MINUTE_IN_UNIX);
    return () => {
      clearInterval(timer);
    };
  }, [to]);

  return <span>{content}</span>;
};
