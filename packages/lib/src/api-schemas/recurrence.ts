import { Frequency, WeekdayStr } from 'rrule';
import { Event } from '.';

export interface Recurrence {
  id: string;
  groupId: string;
  event: Event;
  start: number;
  freq: Frequency;
  interval?: number;
  byweekday?: WeekdayStr[];
  until?: number;
  count?: number;
}

// in client, while loading events, we need to request all recurrences that start before the end of the range
// for each rrule, we then need to use rrule library to determine when the event instances should each start at
// make the respective event instances, and attach the groupId to them (this will be a client specific Event interface) so we can make edits appropriately later on

// we need the event for each rrule, so we should definitely bundle it within the rule
