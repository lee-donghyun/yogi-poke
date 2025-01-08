import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react/macro";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";

import { DAY_IN_UNIX, MINUTE_IN_UNIX } from "../../service/const";

const getString = (to: Dayjs) => {
  const duration = dayjs.duration(to.diff() + DAY_IN_UNIX - MINUTE_IN_UNIX);
  const hours = duration.get("h");
  const minutes = duration.get("m");
  return msg`${hours}시간 ${minutes}분`;
};

export const Timer = ({ to }: { to: Dayjs }) => {
  const { t } = useLingui();
  const [content, setContent] = useState(() => getString(to));

  useEffect(() => {
    const timer = setInterval(() => {
      setContent(getString(to));
    }, MINUTE_IN_UNIX);
    return () => {
      clearInterval(timer);
    };
  }, [to]);

  return <span>{t(content)}</span>;
};
