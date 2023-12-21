import { db } from '../db/ index';
import { Recurrence } from '../db/schema';

export class RecurrenceRepo {
  static async getByUser(userId: string, startingBefore?: number) {
    let query = db.collection('recurrences').where('owner', '==', userId);

    if (startingBefore != null) {
      query = query.where('start', '<', startingBefore);
    }
    const data = (await query.get()).docs.map((doc) => {
      return { id: doc.id, ...(doc.data() as Recurrence) };
    });

    return data;
  }
}
