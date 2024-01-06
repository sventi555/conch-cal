import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import {
  GetRecurrencesReturn,
  PostRecurrencesFromEventReturn,
  PostRecurrencesReturn,
  PutRecurrencesReturn,
  deleteRecurrencesParamSchema,
  getRecurrencesQuerySchema,
  postRecurrencesBodySchema,
  postRecurrencesFromEventBodySchema,
  postRecurrencesFromEventParamSchema,
  putRecurrencesBodySchema,
  putRecurrencesParamSchema,
} from 'lib';
import { verifyToken } from '../middlewares/auth';
import { RecurrenceRepo } from '../repos';
import { moveEventToRecurrence } from '../repos/utils/exchange-recurrence';
import { canEdit } from '../repos/utils/perms';

export const recurrenceRoutes = (app: Hono) => {
  app.get(
    '/recurrences',
    verifyToken,
    zValidator('query', getRecurrencesQuerySchema),
    async (c) => {
      const { userId, before } = c.req.valid('query');
      if (userId !== c.var.userId) {
        throw new HTTPException(400, {
          message: 'userId does not match Authorization header',
        });
      }

      const recurrences = await RecurrenceRepo.getByUser(userId, before);

      return c.json<GetRecurrencesReturn>(recurrences);
    },
  );

  app.post(
    '/recurrences',
    verifyToken,
    zValidator('json', postRecurrencesBodySchema),
    async (c) => {
      const recurrence = c.req.valid('json');

      const res = await RecurrenceRepo.addOne({
        ...recurrence,
        owner: c.var.userId,
      });

      return c.json<PostRecurrencesReturn>(res);
    },
  );

  app.post(
    '/recurrences/from/event/:id',
    verifyToken,
    zValidator('param', postRecurrencesFromEventParamSchema),
    zValidator('json', postRecurrencesFromEventBodySchema),
    async (c) => {
      const eventId = c.req.param('id');
      const recurrenceData = c.req.valid('json');

      const res = await moveEventToRecurrence(eventId, recurrenceData);

      return c.json<PostRecurrencesFromEventReturn>(res);
    },
  );

  app.put(
    '/recurrences/:id',
    verifyToken,
    zValidator('param', putRecurrencesParamSchema),
    zValidator('json', putRecurrencesBodySchema),
    async (c) => {
      const recurrence = c.req.valid('json');
      const { id } = c.req.valid('param');

      const existing = await RecurrenceRepo.getOne(id);
      if (existing == null) {
        throw new HTTPException(404);
      }

      if (!canEdit(existing, c.var.userId)) {
        throw new HTTPException(403);
      }

      const res = await RecurrenceRepo.replaceOne(id, {
        ...recurrence,
        owner: c.var.userId,
      });

      return c.json<PutRecurrencesReturn>(res);
    },
  );

  app.delete(
    '/recurrences/:id',
    verifyToken,
    zValidator('param', deleteRecurrencesParamSchema),
    async (c) => {
      const { id } = c.req.valid('param');

      const existing = await RecurrenceRepo.getOne(id);
      if (existing == null) {
        return c.body(null, 204);
      }

      if (!canEdit(existing, c.var.userId)) {
        throw new HTTPException(403);
      }

      await RecurrenceRepo.deleteOne(id);

      return c.body(null, 204);
    },
  );
};
