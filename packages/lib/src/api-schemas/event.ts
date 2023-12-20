import { z } from 'zod';
import { epochDateSchema, idSchema, stringEpochDateSchema } from './shared';

export interface Event {
  id: string;
  owner: string;
  name: string;
  start: number;
  end: number;
}

export const getEventsQuerySchema = z.object({
  userId: z.string(),
  rangeStart: stringEpochDateSchema,
  rangeEnd: stringEpochDateSchema,
});
export type GetEventsQuery = z.infer<typeof getEventsQuerySchema>;
export type GetEventsReturn = Event[];

export const postEventsBodySchema = z.object({
  name: z.string(),
  start: epochDateSchema,
  end: epochDateSchema,
  description: z.string().optional(),
});
export type PostEventsBody = z.infer<typeof postEventsBodySchema>;
export type PostEventsReturn = Event;

export const putEventsBodySchema = z.object({
  owner: z.string(),
  name: z.string(),
  start: epochDateSchema,
  end: epochDateSchema,
  description: z.string().optional(),
});
export const putEventsParamSchema = idSchema;
export type PutEventsParam = z.infer<typeof putEventsParamSchema>;
export type PutEventsBody = z.infer<typeof putEventsBodySchema>;
export type PutEventsReturn = Event;

export const deleteEventsParamSchema = idSchema;
export type DeleteEventsParam = z.infer<typeof deleteEventsParamSchema>;
