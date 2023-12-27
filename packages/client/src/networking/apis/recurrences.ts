import { User } from 'firebase/auth';
import {
  GetRecurrencesQuery,
  GetRecurrencesReturn,
  PostRecurrencesBody,
  PostRecurrencesReturn,
} from 'lib';
import config from '../../config';
import { toQueryString } from '../utils/query';

const BASE_URI = `${config.hosts.api}/recurrences`;

export class RecurrencesAPI {
  static async getRecurrences(
    user: User,
    before: number,
  ): Promise<GetRecurrencesReturn> {
    const token = await user.getIdToken();

    const query: GetRecurrencesQuery = {
      userId: user.uid,
      before,
    };
    const res = await fetch(`${BASE_URI}?${toQueryString(query)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();

    return body;
  }

  static async postRecurrence(
    recurrence: PostRecurrencesBody,
    user: User,
  ): Promise<PostRecurrencesReturn> {
    const token = await user.getIdToken();

    const res = await fetch(`${BASE_URI}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recurrence),
    });
    const body = await res.json();

    return body;
  }
}
