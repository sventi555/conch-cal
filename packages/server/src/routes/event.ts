import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { verifyToken } from '../middlewares/auth';

export const eventRoutes = (app: Hono) => {
  const getEventsSchema = z.object({ userId: z.string() });
  app.get('/events', verifyToken, zValidator('query', getEventsSchema), (c) => {
    // fetch events from db with user
    const events = [{ title: 'blah' }];

    return c.json(events);
  });
};
