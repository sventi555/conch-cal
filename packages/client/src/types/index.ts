import { Frequency, WeekdayStr } from 'rrule';

interface BaseRecurrence {
  start: number;
  freq: Frequency;
  interval?: number;
  byweekday?: WeekdayStr[];
}

interface EndlessRecurrence extends BaseRecurrence {
  until?: undefined;
  count?: undefined;
}

interface UntilRecurrence extends BaseRecurrence {
  until: number;
  count?: undefined;
}

interface CountRecurrence extends BaseRecurrence {
  until?: undefined;
  count: number;
}

export type Recurrence = EndlessRecurrence | UntilRecurrence | CountRecurrence;

interface BaseEventInfo {
  owner: string;
  name: string;
  start: number;
  end: number;
}

export interface RecurringEventInfo extends BaseEventInfo {
  recurrence: Recurrence;
}

export interface RecurringEvent extends RecurringEventInfo {
  id: string;
  groupId: string;
}

export interface NonRecurringEventInfo extends BaseEventInfo {
  recurrence?: undefined;
}

export interface NonRecurringEvent extends NonRecurringEventInfo {
  id: string;
}

export type EventInfo = RecurringEventInfo | NonRecurringEventInfo;
export type Event = RecurringEvent | NonRecurringEvent;

export const isRecurring = (
  eventInfo: EventInfo,
): eventInfo is RecurringEventInfo => eventInfo.recurrence != null;

// export const isRecurringInfo = (eventInfo: EventInfo): eventInfo is RecurringEventInfo => eventInfo.recurrence
