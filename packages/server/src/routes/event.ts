import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import {
  Event,
  EventInfo,
  GetEventsReturn,
  PostEventsReturn,
  PutEventsReturn,
  deleteEventsParamSchema,
  getEventsQuerySchema,
  postEventsBodySchema,
  putEventsBodySchema,
  putEventsParamSchema,
} from 'lib';
import { Recurrence as DBRecurrence, RecurrenceInfo } from '../db/schema';
import { verifyToken } from '../middlewares/auth';
import { EventRepo, RecurrenceRepo } from '../repos';
import {
  moveEventToRecurrence,
  moveRecurrenceToEvent,
} from '../repos/utils/exchange-recurrence';
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
      // TODO: weed out the recurrences that have an end condition before rangeStart
      const recurrences = (
        await RecurrenceRepo.getByUser(userId, rangeEnd)
      ).map((recurrence) => toLibEvent(recurrence));

      return c.json<GetEventsReturn>([...events, ...recurrences]);
    },
  );

  app.post(
    '/events',
    verifyToken,
    zValidator('json', postEventsBodySchema),
    async (c) => {
      const event = c.req.valid('json');

      let res: PostEventsReturn;
      if (event.recurrence == null) {
        res = await EventRepo.addOne({ ...event, owner: c.var.userId });
      } else {
        const recurrence = await RecurrenceRepo.addOne(
          fromLibEventInfo({ ...event, owner: c.var.userId }),
        );
        res = toLibEvent(recurrence);
      }

      return c.json<PostEventsReturn>(res);
    },
  );

  // TODO: clean this the heck up
  app.put(
    '/events/:id',
    verifyToken,
    zValidator('param', putEventsParamSchema),
    zValidator('json', putEventsBodySchema),
    async (c) => {
      const event = c.req.valid('json');
      const { id } = c.req.valid('param');

      const existingEvent = await EventRepo.getOne(id);
      const existingRecurrence = await RecurrenceRepo.getOne(id);

      if (existingEvent != null && existingRecurrence != null) {
        throw new HTTPException(500);
      }

      const existing = existingEvent ?? existingRecurrence;
      if (existing == null) {
        throw new HTTPException(404);
      }

      if (!canEdit(existing, c.var.userId)) {
        throw new HTTPException(403);
      }

      let res: PutEventsReturn;
      if (event.recurrence == null) {
        // target is event
        if (existingEvent) {
          // replacing existing event
          res = await EventRepo.replaceOne(id, {
            ...event,
            owner: c.var.userId,
          });
        } else {
          // moving recurrence to event
          res = await moveRecurrenceToEvent(id, {
            ...event,
            owner: c.var.userId,
          });
        }
      } else {
        // target is recurrence
        if (existingEvent) {
          // move event to recurrence
          res = toLibEvent(
            await moveEventToRecurrence(
              id,
              fromLibEventInfo({ ...event, owner: c.var.userId }),
            ),
          );
        } else {
          // replace existing recurrence
          res = toLibEvent(
            await RecurrenceRepo.replaceOne(
              id,
              fromLibEventInfo({ ...event, owner: c.var.userId }),
            ),
          );
        }
      }

      return c.json<PutEventsReturn>(res);
    },
  );

  app.delete(
    '/events/:id',
    verifyToken,
    zValidator('param', deleteEventsParamSchema),
    async (c) => {
      const { id } = c.req.valid('param');

      const existingEvent = await EventRepo.getOne(id);
      const existingRecurrence = await RecurrenceRepo.getOne(id);

      if (existingEvent != null && existingRecurrence != null) {
        throw new HTTPException(500);
      }

      const existing = existingEvent || existingRecurrence;
      if (existing == null) {
        return c.body(null, 204);
      }

      if (!canEdit(existing, c.var.userId)) {
        throw new HTTPException(403);
      }

      if (existingEvent != null) {
        await EventRepo.deleteOne(id);
      } else if (existingRecurrence != null) {
        await RecurrenceRepo.deleteOne(id);
      }

      return c.body(null, 204);
    },
  );
};

// TODO better way to extract exactly the correct fields
const toLibEvent = (recurrence: DBRecurrence): Event => {
  return {
    id: recurrence.id,
    owner: recurrence.owner,
    ...recurrence.event,
  };
};

const fromLibEventInfo = (
  event: EventInfo & { owner: string },
): RecurrenceInfo => {
  if (event.recurrence == null) {
    throw new Error('cannot convert to recurrence');
  }

  return {
    ...event.recurrence,
    owner: event.owner,
    event,
  };
};
