import { DateRange } from 'lib';
import { RRule } from 'rrule';
import { Event, Recurrence, RecurringEvent } from '../types';

const toRRule = (recurrence: Recurrence) => {
  console.log('recurrence', recurrence);
  return new RRule({
    dtstart: new Date(recurrence.start),
    freq: recurrence.freq,
    interval: recurrence.interval ?? 1,
    byweekday: recurrence.byweekday,
    until: recurrence.until ? new Date(recurrence.until) : undefined,
    count: recurrence.count,
  });
};

const moveEventToDay = (event: Event, date: Date): Event => {
  const eventStartDate = new Date(event.start);

  // set the event start to the correct day and keep the hour/min
  eventStartDate.setUTCFullYear(date.getUTCFullYear());
  eventStartDate.setUTCMonth(date.getUTCMonth());
  eventStartDate.setUTCDate(date.getUTCDate());

  const newEventStart = eventStartDate.getTime();
  const eventDuration = event.end - event.start;

  return { ...event, start: newEventStart, end: newEventStart + eventDuration };
};

export const eventInstances = (
  event: RecurringEvent,
  range: DateRange,
): Event[] => {
  console.log('event', event);
  const rrule = toRRule(event.recurrence);
  const dates = rrule.between(new Date(range[0]), new Date(range[1]));
  const instances = dates.map((date) => ({
    ...moveEventToDay(event, date),
  }));

  return instances;
};
