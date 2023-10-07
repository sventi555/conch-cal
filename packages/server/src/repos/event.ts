import { Event, EventData } from 'lib';
import { db } from '../db/ index';

export class EventRepo {
  static async getAllByUser(userId: string): Promise<Event[]> {
    const data = (
      await db.collection('events').where('owner', '==', userId).get()
    ).docs.map((doc) => {
      return { id: doc.id, ...(doc.data() as EventData) };
    });

    return data;
  }

  static async addOne(event: EventData): Promise<Event> {
    const doc = await db.collection('events').add(event);

    return { id: doc.id, ...event };
  }

  static async replaceOne(id: string, event: EventData): Promise<Event> {
    const doc = await db.doc(`events/${id}`);
    await doc.set(event);

    return { id, ...event };
  }

  static async deleteOne(id: string) {
    const doc = await db.doc(`events/${id}`);
    await doc.delete();
  }
}
