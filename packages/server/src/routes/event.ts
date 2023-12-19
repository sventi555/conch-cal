import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import {
  GetEventsReturn,
  PostEventsReturn,
  PutEventsReturn,
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
      const { userId, rangeStart, rangeEnd } = c.req.valid('query');
      if (userId !== c.var.userId) {
        throw new HTTPException(400, {
          message: 'userId does not match Authorization header',
        });
      }

      if (rangeStart >= rangeEnd) {
        throw new HTTPException(400, {
          message: 'rangeEnd must be greater than rangeStart',
        });
      }

      const events = await EventRepo.getAllByUser(userId, [
        rangeStart,
        rangeEnd,
      ]);

      return c.json<GetEventsReturn>(events);
    },
  );

  app.post(
    '/events',
    verifyToken,
    zValidator('json', postEventsBodySchema),
    async (c) => {
      const event = c.req.valid('json');
      const res = await EventRepo.addOne({ ...event, owner: c.var.userId });

      return c.json<PostEventsReturn>(res);
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

      const canEdit = await EventRepo.canEdit(id, c.var.userId);
      if (!canEdit) {
        throw new HTTPException(403);
      }

      const res = await EventRepo.replaceOne(id, {
        ...event,
        owner: c.var.userId,
      });

      return c.json<PutEventsReturn>(res);
    },
  );

  app.delete(
    '/events/:id',
    verifyToken,
    zValidator('param', deleteEventsParamSchema),
    async (c) => {
      const { id } = c.req.valid('param');

      const canEdit = await EventRepo.canEdit(id, c.var.userId);
      if (!canEdit) {
        throw new HTTPException(403);
      }

      await EventRepo.deleteOne(id);

      return c.body(null, 204);
    },
  );
};
