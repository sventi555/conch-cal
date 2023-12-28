import { Frequency, WeekdayStr } from 'rrule';
import z from 'zod';
import { Event, postEventsBodySchema } from '.';
import { epochDateSchema, idSchema, stringEpochDateSchema } from './shared';

export interface Recurrence {
  id: string;
  groupId: string;
  owner: string;
  event: Omit<Event, 'id' | 'owner'>;
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
  interval: z.number().int().min(1).optional(),
  byweekday: z
    .array(z.enum(['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']))
    .optional(),
});
export type PostRecurrencesBody = z.infer<typeof postRecurrencesBodySchema>;
export type PostRecurrencesReturn = Recurrence;

export const putRecurrencesBodySchema = z.object({
  groupId: z.string(),
  owner: z.string(),
  event: postEventsBodySchema,
  start: epochDateSchema,
  freq: z.nativeEnum(Frequency),
  interval: z.number().int().min(1).optional(),
  byweekday: z
    .array(z.enum(['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']))
    .optional(),
});
export const putRecurrencesParamSchema = idSchema;
export type PutRecurrencesParam = z.infer<typeof putRecurrencesParamSchema>;
export type PutRecurrencesBody = z.infer<typeof putRecurrencesBodySchema>;
export type PutRecurrencesReturn = Recurrence;

export const deleteRecurrencesParamSchema = idSchema;
export type DeleteRecurrencesParam = z.infer<
  typeof deleteRecurrencesParamSchema
>;
