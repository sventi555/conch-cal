import { Frequency, WeekdayStr } from 'rrule';

export interface Recurrence {
  id: string;
  groupId: string;
  freq: Frequency;
  interval: number;
  byweekday?: WeekdayStr[];
  until?: number;
  count?: number;
}

/**
 * `id` and `rrule` are mutually exclusive.
 * If the event represents an instance of a recurrence, then `rrule` should be
 * defined. Otherwise, `id` should be defined.
 */
export interface Event {
  id?: string;
  owner: string;
  name: string;
  start: number;
  end: number;
  recurrence?: Recurrence;
}
