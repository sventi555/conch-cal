import { Frequency, WeekdayStr } from 'rrule';

export interface Event {
  owner: string;
  name: string;
  start: number;
  end: number;
}

export interface Recurrence {
  groupId: string;
  event: Event;
  start: number;
  freq: keyof typeof Frequency;
  interval?: number;
  byweekday?: WeekdayStr[];
  until?: number;
  count?: number;
}

export interface DB {
  events: Event[];
  recurrences: Recurrence[];
}
