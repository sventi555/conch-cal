import { db } from '../db/ index';
import { Recurrence } from '../db/schema';
import { converter } from './utils/converter';
import { WithID } from './utils/types';

interface RecurrenceWithID extends Recurrence, WithID {}

const collection = db
  .collection('recurrences')
  .withConverter(converter<Recurrence>());

export class RecurrenceRepo {
  static async getByUser(
    userId: string,
    startingBefore?: number,
  ): Promise<RecurrenceWithID[]> {
    let query = collection.where('owner', '==', userId);

    if (startingBefore != null) {
      query = query.where('start', '<', startingBefore);
    }
    const data = (await query.get()).docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });

    return data;
  }

  static async addOne(recurrence: Recurrence): Promise<RecurrenceWithID> {
    const doc = await collection.add(recurrence);

    return { id: doc.id, ...recurrence };
  }
}
