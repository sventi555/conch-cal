import { DateRange, inRange, range } from 'lib';
import { useEffect, useState } from 'react';
import { useAuth } from '../auth';
import { useEventsDispatch } from '../state/Events';
import { NonRecurringEvent, RecurringEvent } from '../types';
import { MS_PER_DAY } from '../utils/date';
import { EventsAPI } from './apis/events';

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
        const [nonRecurringEvents, recurringEvents] = events.reduce<
          [NonRecurringEvent[], RecurringEvent[]]
        >(
          ([nonRecurring, recurring], event) => {
            if (event.recurrence == null) {
              nonRecurring.push(event);
            } else {
              recurring.push(event);
            }

            return [nonRecurring, recurring];
          },
          [[], []],
        );

        dispatch({
          type: 'set',
          events: nonRecurringEvents,
          recurringEvents: recurringEvents,
          loadedRange: newRange,
        });
      });
    }
  }, [dispatch, user, focusedTime, loadedRange]);

  return loadedRange;
};
