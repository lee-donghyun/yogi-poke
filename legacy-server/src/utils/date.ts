const DAY = 1000 * 60 * 60 * 24;

export const getDiff =
  (unit: number) => (a: Date | number, b: Date | number) => {
    const aUnix = typeof a === 'number' ? a : a.getTime();
    const bUnix = typeof b === 'number' ? b : b.getTime();
    return Math.floor((bUnix - aUnix) / unit);
  };

export const getDiffDays = getDiff(DAY);
