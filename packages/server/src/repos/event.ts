import { Transaction } from '@google-cloud/firestore';
import { DateRange } from 'lib';
import { db } from '../db/ index';
import { Event, EventInfo } from '../db/schema';
import { converter } from './utils/converter';
import { useTransaction } from './utils/transaction';

const collection = db.collection('events').withConverter(converter<Event>());

export class EventRepo {
  static async getOne(
    id: string,
    transaction?: Transaction,
  ): Promise<Event | undefined> {
    return await useTransaction(transaction, async (transaction) => {
      const doc = await collection.doc(id);
      const data = (await transaction.get(doc)).data();

      if (data == null) {
        return undefined;
      }

      return data;
    });
  }

  static async getByUser(
    userId: string,
    range?: DateRange,
    transaction?: Transaction,
  ): Promise<Event[]> {
    return await useTransaction(transaction, async (transaction) => {
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
      const data = (await transaction.get(query)).docs.map((doc) => doc.data());

      return data;
    });
  }

  static async addOne(
    event: EventInfo,
    transaction?: Transaction,
  ): Promise<Event> {
    return await useTransaction(transaction, async (transaction) => {
      const doc = collection.doc();
      const data = { id: doc.id, ...event };
      await transaction.create(doc, data);

      return data;
    });
  }

  static async replaceOne(
    id: string,
    event: EventInfo,
    transaction?: Transaction,
  ): Promise<Event> {
    return await useTransaction(transaction, async (transaction) => {
      const doc = await collection.doc(id);
      const data = { id, ...event };
      await transaction.update(doc, data);

      return data;
    });
  }

  static async deleteOne(id: string, transaction?: Transaction) {
    return await useTransaction(transaction, async (transaction) => {
      const doc = await collection.doc(id);
      await transaction.delete(doc);
    });
  }
}
