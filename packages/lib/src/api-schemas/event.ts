import { z } from 'zod';

export interface Event {
  id: string;
  owner: string;
  name: string;
  start: number;
  end: number;
}

const idSchema = z.object({
  id: z.string(),
});

export const getEventsQuerySchema = z.object({
  userId: z.string(),
  rangeStart: z.string().pipe(z.coerce.number()),
  rangeEnd: z.string().pipe(z.coerce.number()),
});
export type GetEventsQuery = z.infer<typeof getEventsQuerySchema>;
export type GetEventsReturn = Event[];

export const postEventsBodySchema = z.object({
  name: z.string(),
  start: z.number(),
  end: z.number(),
  description: z.string().optional(),
});
export type PostEventsBody = z.infer<typeof postEventsBodySchema>;
export type PostEventsReturn = Event;

export const putEventsBodySchema = z.object({
  owner: z.string(),
  name: z.string(),
  start: z.number(),
  end: z.number(),
  description: z.string().optional(),
});
export const putEventsParamSchema = idSchema;
export type PutEventsParam = z.infer<typeof putEventsParamSchema>;
export type PutEventsBody = z.infer<typeof putEventsBodySchema>;
export type PutEventsReturn = Event;

export const deleteEventsParamSchema = idSchema;
export type DeleteEventsParam = z.infer<typeof deleteEventsParamSchema>;
