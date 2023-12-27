import { DateRange, inRange, range } from 'lib';
import { useEffect, useState } from 'react';
import { useAuth } from '../auth';
import { useEventsDispatch } from '../state/events';
import { MS_PER_DAY } from '../utils/date';
import { recurrenceInstances } from '../utils/recurrence';
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
          const allRecurrenceInstances = recurrences
            .map((recurrence) => recurrenceInstances(recurrence, newRange))
            .flat();
          dispatch({
            type: 'set',
            events: [...events, ...allRecurrenceInstances],
          });
        });
      });
    }
  }, [dispatch, user, focusedTime, loadedRange]);
};
