import { EventRepo, RecurrenceRepo } from '..';
import { db } from '../../db/ index';
import { Event, EventInfo, Recurrence, RecurrenceInfo } from '../../db/schema';

export const moveEventToRecurrence = async (
  eventId: string,
  recurrenceInfo: RecurrenceInfo,
): Promise<Recurrence> => {
  return await db.runTransaction(async (transaction) => {
    const event = await EventRepo.getOne(eventId, transaction);
    if (event == null) {
      throw new Error('event not found');
    }

    await EventRepo.deleteOne(eventId, transaction);

    const recurrence = await RecurrenceRepo.addOne(recurrenceInfo, transaction);

    return recurrence;
  });
};

export const moveRecurrenceToEvent = async (
  recurrenceId: string,
  eventInfo: EventInfo,
): Promise<Event> => {
  return await db.runTransaction(async (transaction) => {
    const recurrence = await RecurrenceRepo.getOne(recurrenceId, transaction);
    if (recurrence == null) {
      throw new Error('could not find recurrence');
    }

    await RecurrenceRepo.deleteOne(recurrenceId, transaction);

    const event = await EventRepo.addOne(eventInfo, transaction);

    return event;
  });
};
