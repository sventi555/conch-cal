import { useState } from 'react';

export const MS_PER_HOUR = 60 * 60 * 1000;
export const MS_PER_DAY = 24 * MS_PER_HOUR;

export const dayStringFromDate = (d: Date) => {
  const year = `${d.getFullYear()}`.padStart(4, '0');
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const timeStringFromDate = (d: Date) => {
  const hours = `${d.getHours()}`.padStart(2, '0');
  const mins = `${d.getMinutes()}`.padStart(2, '0');

  return `${hours}:${mins}`;
};

export const dateFromDayAndTime = (day: string, time: string) => {
  return new Date(`${day}T${time}`);
};

interface TimeBlock {
  startDay: string;
  startTime: string;
  endDay: string;
  endTime: string;
}

export interface TimeBlockSetters {
  setStartDay: (day: string) => void;
  setStartTime: (time: string) => void;
  setEndDay: (day: string) => void;
  setEndTime: (time: string) => void;
}

export type TimeBlockState = TimeBlock & TimeBlockSetters;

export const useTimeBlock = (initialTimeBlock: TimeBlock): TimeBlockState => {
  const [startDay, setStartDay] = useState(initialTimeBlock.startDay);
  const [startTime, setStartTime] = useState(initialTimeBlock.startTime);
  const [endDay, setEndDay] = useState(initialTimeBlock.endDay);
  const [endTime, setEndTime] = useState(initialTimeBlock.endTime);

  return {
    startDay,
    setStartDay,
    startTime,
    setStartTime,
    endDay,
    setEndDay,
    endTime,
    setEndTime,
  };
};

export const setTimeBlockState = (
  timeBlock: TimeBlockState,
  startDate: Date,
  endDate: Date,
) => {
  timeBlock.setStartDay(dayStringFromDate(startDate));
  timeBlock.setStartTime(timeStringFromDate(startDate));
  timeBlock.setEndDay(dayStringFromDate(endDate));
  timeBlock.setEndTime(timeStringFromDate(endDate));
};
