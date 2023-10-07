import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import {
  GetEventsReturnType,
  PostEventsReturnType,
  PutEventsReturnType,
  deleteEventsParamSchema,
  getEventsQuerySchema,
  postEventsBodySchema,
  putEventsBodySchema,
  putEventsParamSchema,
} from 'lib';
import { verifyToken } from '../middlewares/auth';
import { EventRepo } from '../repos';

export const eventRoutes = (app: Hono) => {
  app.get(
    '/events',
    verifyToken,
    zValidator('query', getEventsQuerySchema),
    async (c) => {
      const { userId } = c.req.valid('query');
      if (userId !== c.var.userId) {
        throw new HTTPException(400);
      }

      const events = await EventRepo.getAllByUser(userId);

      return c.json<GetEventsReturnType>(events);
    },
  );

  app.post(
    '/events',
    verifyToken,
    zValidator('json', postEventsBodySchema),
    async (c) => {
      const event = c.req.valid('json');
      const res = await EventRepo.addOne({ ...event, owner: c.var.userId });

      return c.json<PostEventsReturnType>(res);
    },
  );

  app.put(
    '/events/:id',
    verifyToken,
    zValidator('param', putEventsParamSchema),
    zValidator('json', putEventsBodySchema),
    async (c) => {
      const event = c.req.valid('json');
      const { id } = c.req.valid('param');
      const res = await EventRepo.replaceOne(id, {
        ...event,
        owner: c.var.userId,
      });

      return c.json<PutEventsReturnType>(res);
    },
  );

  app.delete(
    '/events/:id',
    verifyToken,
    zValidator('param', deleteEventsParamSchema),
    async (c) => {
      const { id } = c.req.valid('param');
      await EventRepo.deleteOne(id);

      return c.body(null, 204);
    },
  );
};
