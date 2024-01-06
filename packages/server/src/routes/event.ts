import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import {
  GetEventsReturn,
  PostEventsFromRecurrenceReturn,
  PostEventsReturn,
  PutEventsReturn,
  deleteEventsParamSchema,
  getEventsQuerySchema,
  postEventsBodySchema,
  postEventsFromRecurrenceParamSchema,
  putEventsBodySchema,
  putEventsParamSchema,
} from 'lib';
import { verifyToken } from '../middlewares/auth';
import { EventRepo } from '../repos';
import { moveRecurrenceToEvent } from '../repos/utils/exchange-recurrence';
import { canEdit } from '../repos/utils/perms';

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

      const events = await EventRepo.getByUser(userId, [rangeStart, rangeEnd]);

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

  app.post(
    '/events/from/recurrence/:id',
    verifyToken,
    zValidator('param', postEventsFromRecurrenceParamSchema),
    async (c) => {
      const recurrenceId = c.req.param('id');
      const res = await moveRecurrenceToEvent(recurrenceId);

      return c.json<PostEventsFromRecurrenceReturn>(res);
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

      const existing = await EventRepo.getOne(id);
      if (existing == null) {
        throw new HTTPException(404);
      }

      if (!canEdit(existing, c.var.userId)) {
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

      const existing = await EventRepo.getOne(id);
      if (existing == null) {
        return c.body(null, 204);
      }

      if (!canEdit(existing, c.var.userId)) {
        throw new HTTPException(403);
      }

      await EventRepo.deleteOne(id);

      return c.body(null, 204);
    },
  );
};
