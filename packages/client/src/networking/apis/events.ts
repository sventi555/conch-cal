import { User } from 'firebase/auth';
import {
  GetEventsQuery,
  GetEventsReturn,
  PostEventsBody,
  PostEventsReturn,
  PutEventsBody,
  PutEventsReturn,
} from 'lib';
import config from '../../config';
import { DateRange } from '../../utils/date';
import { toQueryString } from '../utils/query';

const BASE_URI = `${config.hosts.api}/events`;

export class EventsAPI {
  static async getEvents(
    user: User,
    range: DateRange,
  ): Promise<GetEventsReturn> {
    const token = await user.getIdToken();

    const query: GetEventsQuery = {
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

  static async postEvent(
    event: PostEventsBody,
    user: User,
  ): Promise<PostEventsReturn> {
    const token = await user.getIdToken();

    const res = await fetch(`${BASE_URI}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    const body = await res.json();

    return body;
  }

  static async putEvent(
    id: string,
    event: PutEventsBody,
    user: User,
  ): Promise<PutEventsReturn> {
    const token = await user.getIdToken();
    const res = await fetch(`${BASE_URI}/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    const body = await res.json();

    return body;
  }

  static async deleteEvent(id: string, user: User) {
    const token = await user.getIdToken();
    await fetch(`${BASE_URI}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
