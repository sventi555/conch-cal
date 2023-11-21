import { User } from 'firebase/auth';
import {
  GetEventsQueryType,
  GetEventsReturnType,
  PostEventsBodyType,
  PostEventsReturnType,
  PutEventsBodyType,
  PutEventsReturnType,
} from 'lib';
import config from '../../config';

const BASE_URI = `${config.hosts.api}/events`;

export class EventsAPI {
  static async getEvents(user: User): Promise<GetEventsReturnType> {
    const token = await user.getIdToken();

    const query: GetEventsQueryType = { userId: user.uid };
    const queryString = new URLSearchParams(query);
    const res = await fetch(`${BASE_URI}?${queryString}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();

    return body;
  }

  static async postEvent(
    event: PostEventsBodyType,
    user: User,
  ): Promise<PostEventsReturnType> {
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
    event: PutEventsBodyType,
    user: User,
  ): Promise<PutEventsReturnType> {
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
