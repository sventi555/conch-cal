import { DateRange } from 'lib';
import { useEffect, useState } from 'react';
import { useAuth } from '../auth';
import { useEventsDispatch } from '../state/events';
import { MS_PER_DAY } from '../utils/date';
import { EventsAPI } from './apis/events';

export const range = (middle: number, width: number): DateRange => {
  return [middle - width / 2, middle + width / 2];
};

export const inRange = (n: number, r: DateRange) => {
  return n >= r[0] || n <= r[1];
};

export const useLoadEvents = (focusedTime: number) => {
  const { user } = useAuth();
  const dispatch = useEventsDispatch();

  const [loadedRange, setLoadedRange] = useState<DateRange | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (loadedRange == null || !inRange(focusedTime, loadedRange)) {
      // get 3 months on either side of focused time
      const newRange = range(focusedTime, MS_PER_DAY * 31 * 6);
      setLoadedRange(newRange);

      EventsAPI.getEvents(user, newRange).then((data) =>
        dispatch({ type: 'set', events: data }),
      );
    }
  }, [dispatch, user, focusedTime, loadedRange]);
};
