import dayjs from "dayjs";

export const getReadableDateOffset = (date: string) => {
  const now = dayjs();
  const then = dayjs(date);

  const diffDays = now.diff(then, "day");

  if (diffDays === 0) {
    return "오늘";
  }
  if (diffDays < 7) {
    return `${diffDays}일 전`;
  }
  if (now.diff(then, "year") < 1) {
    return then.format("M/D");
  }
  return then.format("Y M/D");
};
