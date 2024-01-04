import { Transaction } from '@google-cloud/firestore';
import { db } from '../db/ index';
import { Recurrence } from '../db/schema';
import { converter } from './utils/converter';
import { useTransaction } from './utils/transaction';
import { WithID } from './utils/types';

interface RecurrenceWithID extends Recurrence, WithID {}

const collection = db
  .collection('recurrences')
  .withConverter(converter<Recurrence>());

export class RecurrenceRepo {
  static async getOne(
    id: string,
    transaction?: Transaction,
  ): Promise<RecurrenceWithID | undefined> {
    return await useTransaction(transaction, async (transaction) => {
      const doc = await collection.doc(id);
      const data = (await transaction.get(doc)).data();

      if (data == null) {
        return undefined;
      }

      return { ...data, id };
    });
  }

  static async getByUser(
    userId: string,
    startingBefore?: number,
    transaction?: Transaction,
  ): Promise<RecurrenceWithID[]> {
    return await useTransaction(transaction, async (transaction) => {
      let query = collection.where('owner', '==', userId);

      if (startingBefore != null) {
        query = query.where('start', '<', startingBefore);
      }
      const data = (await transaction.get(query)).docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });

      return data;
    });
  }

  static async addOne(
    recurrence: Recurrence,
    transaction?: Transaction,
  ): Promise<RecurrenceWithID> {
    return await useTransaction(transaction, async (transaction) => {
      const doc = await collection.doc();
      await transaction.create(doc, recurrence);

      return { id: doc.id, ...recurrence };
    });
  }

  static async replaceOne(
    id: string,
    recurrence: Recurrence,
    transaction?: Transaction,
  ): Promise<RecurrenceWithID> {
    return await useTransaction(transaction, async (transaction) => {
      const doc = await collection.doc(id);
      await transaction.update(doc, recurrence);

      return { id, ...recurrence };
    });
  }

  static async deleteOne(id: string, transaction?: Transaction) {
    return await useTransaction(transaction, async (transaction) => {
      const doc = await collection.doc(id);
      await transaction.delete(doc);
    });
  }
}
