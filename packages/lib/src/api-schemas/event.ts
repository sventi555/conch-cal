import { z } from 'zod';

export interface Event {
  owner: string;
  name: string;
  start: number;
  end: number;
  description?: string;
}

export const getEventsQuerySchema = z.object({ userId: z.string() });
export type GetEventsQueryType = z.infer<typeof getEventsQuerySchema>;
export type GetEventsReturnType = Event[];

export const postEventsBodySchema = z.object({
  name: z.string(),
  start: z.number(),
  end: z.number(),
  description: z.string().optional(),
});
export type PostEventsBodyType = z.infer<typeof postEventsBodySchema>;
export type PostEventsReturnType = Event;
