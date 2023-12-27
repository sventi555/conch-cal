import { Frequency, WeekdayStr } from 'rrule';
import z from 'zod';
import { Event, postEventsBodySchema } from '.';
import { epochDateSchema, stringEpochDateSchema } from './shared';

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

export const postRecurrencesBodySchema = z.object({
  event: postEventsBodySchema,
  start: epochDateSchema,
  freq: z.nativeEnum(Frequency),
  interval: z.number().int().positive().optional(),
  byweekday: z
    .array(z.enum(['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']))
    .optional(),
});
export type PostRecurrencesBody = z.infer<typeof postRecurrencesBodySchema>;
export type PostRecurrencesReturn = Recurrence;
