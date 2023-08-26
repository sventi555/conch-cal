import { useState } from 'react';

export const MS_PER_HOUR = 60 * 60 * 1000;
export const MS_PER_DAY = 24 * MS_PER_HOUR;

export const dayFromDate = (d: Date) => {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

export const timeFromDate = (d: Date) => {
  return `${d.getHours()}:${d.getMinutes()}`;
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
