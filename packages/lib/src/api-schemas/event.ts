import { Frequency, WeekdayStr } from 'rrule';
import { z } from 'zod';
import { epochDateSchema, idSchema, stringEpochDateSchema } from './shared';

export interface Event {
  id: string;
  owner: string;
  name: string;
  start: number;
  end: number;
  recurrence?: {
    start: number;
    freq: Frequency;
    interval?: number;
    byweekday?: WeekdayStr[];
    until?: number;
    count?: number;
  };
}

export const getEventsQuerySchema = z.object({
  userId: z.string(),
  rangeStart: stringEpochDateSchema,
  rangeEnd: stringEpochDateSchema,
});
export type GetEventsQuery = z.infer<typeof getEventsQuerySchema>;
export type GetEventsReturn = Event[];

const eventInfoSchema = z.object({
  name: z.string(),
  start: epochDateSchema,
  end: epochDateSchema,
  recurrence: z
    .object({
      start: epochDateSchema,
      freq: z.nativeEnum(Frequency),
      interval: z.number().int().min(1).optional(),
      byweekday: z
        .array(z.enum(['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU']))
        .optional(),
      until: epochDateSchema.optional(),
      count: z.number().int().min(1).optional(),
    })
    .optional(),
});
export type EventInfo = z.infer<typeof eventInfoSchema>;

export const postEventsBodySchema = eventInfoSchema;
export type PostEventsBody = z.infer<typeof postEventsBodySchema>;
export type PostEventsReturn = Event;

export const putEventsBodySchema = eventInfoSchema;
export const putEventsParamSchema = idSchema;
export type PutEventsParam = z.infer<typeof putEventsParamSchema>;
export type PutEventsBody = z.infer<typeof putEventsBodySchema>;
export type PutEventsReturn = Event;

export const deleteEventsParamSchema = idSchema;
export type DeleteEventsParam = z.infer<typeof deleteEventsParamSchema>;
