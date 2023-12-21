import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { GetRecurrencesReturn, getRecurrencesQuerySchema } from 'lib';
import { verifyToken } from '../middlewares/auth';
import { RecurrenceRepo } from '../repos/recurrence';

export const eventRoutes = (app: Hono) => {
  app.get(
    '/recurrence',
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
};
