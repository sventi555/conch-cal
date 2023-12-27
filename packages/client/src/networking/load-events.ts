import { DateRange, inRange, range } from 'lib';
import { useEffect, useState } from 'react';
import { useAuth } from '../auth';
import { useEventsDispatch } from '../state/events';
import { MS_PER_DAY } from '../utils/date';
import { EventsAPI } from './apis/events';
import { RecurrencesAPI } from './apis/recurrences';

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

      EventsAPI.getEvents(user, newRange).then((events) => {
        RecurrencesAPI.getRecurrences(user, newRange[1]).then((recurrences) => {
          dispatch({
            type: 'set',
            events,
            recurringEvents: recurrences.map((recurrence) => ({
              ...recurrence.event,
              recurrence,
            })),
            loadedRange: newRange,
          });
        });
      });
    }
  }, [dispatch, user, focusedTime, loadedRange]);
};
