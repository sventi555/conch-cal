import { Frequency, WeekdayStr } from 'rrule';
import z from 'zod';
import { Event } from '.';
import { stringEpochDateSchema } from './shared';

export interface Recurrence {
  id: string;
  groupId: string;
  event: Omit<Event, 'id'>;
  start: number;
  freq: Frequency;
  interval?: number;
  byweekday?: WeekdayStr[];
  until?: number;
  count?: number;
}

export const getRecurrencesQuerySchema = z.object({
  userId: z.string(),
  before: stringEpochDateSchema,
});
export type GetRecurrencesQuery = z.infer<typeof getRecurrencesQuerySchema>;
export type GetRecurrencesReturn = Recurrence[];
