import { Frequency, WeekdayStr } from 'rrule';

export interface Recurrence {
  start: number;
  freq: Frequency;
  interval?: number;
  byweekday?: WeekdayStr[];
  until?: number;
  count?: number;
}

interface BaseEventInfo {
  owner: string;
  name: string;
  start: number;
  end: number;
}

export interface RecurringEventInfo extends BaseEventInfo {
  recurrence: Recurrence;
}

export interface NonRecurringEventInfo extends BaseEventInfo {
  recurrence?: undefined;
}

export type EventInfo = RecurringEventInfo | NonRecurringEventInfo;

export interface RecurringEvent extends RecurringEventInfo {
  id: string;
}

export interface NonRecurringEvent extends NonRecurringEventInfo {
  id: string;
}

export type Event = RecurringEvent | NonRecurringEvent;

export const isRecurring = (
  eventInfo: EventInfo,
): eventInfo is RecurringEventInfo => eventInfo.recurrence != null;

// export const isRecurringInfo = (eventInfo: EventInfo): eventInfo is RecurringEventInfo => eventInfo.recurrence
