import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import {
  GetRecurrencesReturn,
  PostRecurrencesReturn,
  PutRecurrencesReturn,
  deleteRecurrencesParamSchema,
  getRecurrencesQuerySchema,
  postRecurrencesBodySchema,
  putRecurrencesBodySchema,
  putRecurrencesParamSchema,
} from 'lib';
import { v4 as uuid } from 'uuid';
import { verifyToken } from '../middlewares/auth';
import { RecurrenceRepo } from '../repos/recurrence';

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

      const groupId = uuid();
      const res = await RecurrenceRepo.addOne({
        ...recurrence,
        groupId,
        owner: c.var.userId,
      });

      return c.json<PostRecurrencesReturn>(res);
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

      const canEdit = await RecurrenceRepo.canEdit(id, c.var.userId);
      if (!canEdit) {
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

      const canEdit = await RecurrenceRepo.canEdit(id, c.var.userId);
      if (!canEdit) {
        throw new HTTPException(403);
      }

      await RecurrenceRepo.deleteOne(id);

      return c.body(null, 204);
    },
  );
};
