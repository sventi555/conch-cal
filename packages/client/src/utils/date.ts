export const MS_PER_HOUR = 60 * 60 * 1000;
export const MS_PER_DAY = 24 * MS_PER_HOUR;

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
