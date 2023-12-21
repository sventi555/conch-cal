import { db } from '../db/ index';
import { Recurrence } from '../db/schema';
import { converter } from './utils/converter';

const collection = db
  .collection('recurrences')
  .withConverter(converter<Recurrence>());

export class RecurrenceRepo {
  static async getByUser(userId: string, startingBefore?: number) {
    let query = collection.where('owner', '==', userId);

    if (startingBefore != null) {
      query = query.where('start', '<', startingBefore);
    }
    const data = (await query.get()).docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });

    return data;
  }
}
