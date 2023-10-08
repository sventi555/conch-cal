import { z } from 'zod';

export interface EventData {
  owner: string;
  name: string;
  start: number;
  end: number;
  description?: string;
}

export interface Event extends EventData {
  id: string;
}

const eventDataSchema = z.object({
  name: z.string(),
  start: z.number(),
  end: z.number(),
  description: z.string().optional(),
});

const idSchema = z.object({
  id: z.string(),
});

export const getEventsQuerySchema = z.object({ userId: z.string() });
export type GetEventsQueryType = z.infer<typeof getEventsQuerySchema>;
export type GetEventsReturnType = Event[];

export const postEventsBodySchema = eventDataSchema;
export type PostEventsBodyType = z.infer<typeof postEventsBodySchema>;
export type PostEventsReturnType = Event;

export const putEventsParamSchema = idSchema;
export type PutEventsParamType = z.infer<typeof putEventsParamSchema>;
export const putEventsBodySchema = eventDataSchema;
export type PutEventsBodyType = z.infer<typeof putEventsBodySchema>;
export type PutEventsReturnType = Event;

export const deleteEventsParamSchema = idSchema;
export type DeleteEventsParamType = z.infer<typeof deleteEventsParamSchema>;
