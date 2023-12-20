import { User } from 'firebase/auth';
import { DateRange, GetRecurrencesQuery, GetRecurrencesReturn } from 'lib';
import config from '../../config';
import { toQueryString } from '../utils/query';

const BASE_URI = `${config.hosts.api}/recurrences`;

export class RecurrencesAPI {
  static async getRecurrences(
    user: User,
    range: DateRange,
  ): Promise<GetRecurrencesReturn> {
    const token = await user.getIdToken();

    const query: GetRecurrencesQuery = {
      userId: user.uid,
      rangeStart: range[0],
      rangeEnd: range[1],
    };
    const res = await fetch(`${BASE_URI}?${toQueryString(query)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();

    return body;
  }
}
