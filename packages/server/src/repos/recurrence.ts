import { Transaction } from '@google-cloud/firestore';
import { db } from '../db/ index';
import { Recurrence, RecurrenceInfo } from '../db/schema';
import { converter } from './utils/converter';
import { useTransaction } from './utils/transaction';

const collection = db
  .collection('recurrences')
  .withConverter(converter<Recurrence>());

export class RecurrenceRepo {
  static async getOne(
    id: string,
    transaction?: Transaction,
  ): Promise<Recurrence | undefined> {
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
    startingBefore?: number,
    transaction?: Transaction,
  ): Promise<Recurrence[]> {
    return await useTransaction(transaction, async (transaction) => {
      let query = collection.where('owner', '==', userId);

      if (startingBefore != null) {
        query = query.where('start', '<', startingBefore);
      }
      const data = (await transaction.get(query)).docs.map((doc) => doc.data());

      return data;
    });
  }

  static async addOne(
    recurrence: RecurrenceInfo,
    transaction?: Transaction,
  ): Promise<Recurrence> {
    return await useTransaction(transaction, async (transaction) => {
      const doc = await collection.doc();
      const data = { id: doc.id, ...recurrence };
      await transaction.create(doc, data);

      return data;
    });
  }

  static async replaceOne(
    id: string,
    recurrence: RecurrenceInfo,
    transaction?: Transaction,
  ): Promise<Recurrence> {
    return await useTransaction(transaction, async (transaction) => {
      const doc = await collection.doc(id);

      const existing = (await transaction.get(doc)).data();
      if (existing == null) {
        throw new Error('recurrence does not exist');
      }

      const data = { id, ...recurrence };
      await transaction.set(doc, data);

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
