import { db } from '../db/ index';

interface Event {
  owner: string;
  name: string;
  startTime: number;
  endTime: number;
  description?: string;
}

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
