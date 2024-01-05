import { Frequency, WeekdayStr } from 'rrule';

export interface EventInfo {
  owner: string;
  name: string;
  start: number;
  end: number;
}

export interface Event extends EventInfo {
  id: string;
}

export interface RecurrenceInfo {
  owner: string;
  event: Omit<EventInfo, 'owner'>;
  start: number;
  freq: Frequency;
  interval?: number;
  byweekday?: WeekdayStr[];
  until?: number;
  count?: number;
}

export interface Recurrence extends RecurrenceInfo {
  id: string;
  groupId: string;
}

export interface DB {
  events: Event[];
  recurrences: Recurrence[];
}
