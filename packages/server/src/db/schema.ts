import { Frequency, WeekdayStr } from 'rrule';

export interface Event {
  owner: string;
  name: string;
  start: number;
  end: number;
}

export interface Recurrence {
  groupId: string;
  owner: string;
  event: Omit<Event, 'owner'>;
  start: number;
  freq: Frequency;
  interval?: number;
  byweekday?: WeekdayStr[];
  until?: number;
  count?: number;
}

export interface DB {
  events: Event[];
  recurrences: Recurrence[];
}
