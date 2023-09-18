import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import { verifyToken } from '../middlewares/auth';
import { EventRepo } from '../repos';

export const eventRoutes = (app: Hono) => {
  const getEventsSchema = z.object({ userId: z.string() });
  app.get(
    '/events',
    verifyToken,
    zValidator('query', getEventsSchema),
    async (c) => {
      const { userId } = c.req.valid('query');
      const events = await EventRepo.getAllByUser(userId);

      return c.json(events);
    },
  );

  const postEventsSchema = z.object({
    name: z.string(),
    startTime: z.number(),
    endTime: z.number(),
    description: z.string().optional(),
  });
  app.post(
    '/events',
    verifyToken,
    zValidator('json', postEventsSchema),
    async (c) => {
      const event = c.req.valid('json');
      const res = await EventRepo.addOne({ ...event, owner: c.var.userId });

      return c.json(res);
    },
  );
};
