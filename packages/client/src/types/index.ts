import { Frequency, WeekdayStr } from 'rrule';

export interface Recurrence {
  id: string;
  groupId: string;
  start: number;
  freq: Frequency;
  interval?: number;
  byweekday?: WeekdayStr[];
  until?: number;
  count?: number;
}

interface BaseEvent {
  owner: string;
  name: string;
  start: number;
  end: number;
}

export interface RecurringEvent extends BaseEvent {
  id?: undefined;
  recurrence: Recurrence;
}

export interface NonRecurringEvent extends BaseEvent {
  id: string;
  recurrence?: undefined;
}

export type Event = RecurringEvent | NonRecurringEvent;

export const isRecurring = (event: Event): event is RecurringEvent =>
  event.recurrence != null;
