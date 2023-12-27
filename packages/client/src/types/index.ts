import { WeekdayStr } from 'rrule';

type Frequency = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';

interface RRule {
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
  rrule?: RRule;
}
