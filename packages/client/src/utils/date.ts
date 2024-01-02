export const MS_PER_HOUR = 60 * 60 * 1000;
export const MS_PER_DAY = 24 * MS_PER_HOUR;
export const MS_PER_WEEK = 7 * MS_PER_DAY;
const MS_PER_15_MIN = MS_PER_HOUR / 4;

export const dayAndTimeStringFromDate = (time: number) => {
  const d = new Date(time);

  const year = `${d.getFullYear()}`.padStart(4, '0');
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  const hours = `${d.getHours()}`.padStart(2, '0');
  const mins = `${d.getMinutes()}`.padStart(2, '0');

  return {
    day: `${year}-${month}-${day}`,
    time: `${hours}:${mins}`,
  };
};

export const dateFromDayAndTimeString = (day: string, time: string) => {
  return new Date(`${day}T${time}`).getTime();
};

export const isMidnight = (time: number) => {
  return new Date(time).getHours() === 0;
};

export const roundTo15Min = (time: number) => {
  const msSinceLast15 = time % MS_PER_15_MIN;

  if (msSinceLast15 >= MS_PER_15_MIN / 2) {
    return time + (MS_PER_15_MIN - msSinceLast15);
  } else {
    return time - msSinceLast15;
  }
};
