import { Event } from 'lib';
import { db } from '../db/ index';

export class EventRepo {
  static async getAllByUser(userId: string) {
    const data = (
      await db.collection('events').where('owner', '==', userId).get()
    ).docs.map((doc) => doc.data() as Event);

    return data;
  }

  static async addOne(event: Event) {
    await db.collection('events').add(event);

    return event;
  }
}
