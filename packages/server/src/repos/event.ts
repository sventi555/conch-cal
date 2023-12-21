import { DateRange, Event } from 'lib';
import { db } from '../db/ index';
import { Event as DBEvent } from '../db/schema';
import { converter } from './utils/converter';

const collection = db.collection('events').withConverter(converter<DBEvent>());

export class EventRepo {
  static async getByUser(userId: string, range?: DateRange): Promise<Event[]> {
    let query = collection.where('owner', '==', userId);

    // Not allowed to compound query with different field inequealities,
    // therefore simply check if the event starts within the range.
    // This misses events that start before the range, but end within it.
    // Only a problem for really long events, but still need to fix this.
    // https://firebase.google.com/docs/firestore/query-data/queries#compound_and_queries
    // Could split up longer events into parts based on a cutoff and give them a shared identifier.
    if (range != null) {
      query = query
        .where('start', '>=', range[0])
        .where('start', '<', range[1]);
    }
    const data = (await query.get()).docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });

    return data;
  }

  static async addOne(event: DBEvent): Promise<Event> {
    const doc = await collection.add(event);

    return { id: doc.id, ...event };
  }

  static async replaceOne(id: string, event: DBEvent): Promise<Event> {
    const doc = await collection.doc(id);
    await doc.set(event);

    return { id, ...event };
  }

  static async deleteOne(id: string) {
    const doc = await collection.doc(id);
    await doc.delete();
  }

  static async canEdit(id: string, userId: string) {
    const doc = await collection.doc(id);
    const data = (await doc.get()).data();

    return data?.owner === userId;
  }
}
