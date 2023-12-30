import { User } from 'firebase/auth';
import {
  DateRange,
  GetEventsQuery,
  GetEventsReturn,
  PostEventsBody,
  PostEventsReturn,
  PutEventsBody,
  PutEventsReturn,
} from 'lib';
import config from '../../config';
import { NonRecurringEvent, NonRecurringEventInfo } from '../../types';
import { toQueryString } from '../utils/query';

const BASE_URI = `${config.hosts.api}/events`;

export class EventsAPI {
  static async getEvents(
    user: User,
    range: DateRange,
  ): Promise<NonRecurringEvent[]> {
    const token = await user.getIdToken();

    const query: GetEventsQuery = {
      userId: user.uid,
      rangeStart: range[0],
      rangeEnd: range[1],
    };
    const res = await fetch(`${BASE_URI}?${toQueryString(query)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const fetchedEvents: GetEventsReturn = await res.json();

    return fetchedEvents;
  }

  static async postEvent(
    event: NonRecurringEventInfo,
    user: User,
  ): Promise<NonRecurringEvent> {
    const token = await user.getIdToken();

    const body: PostEventsBody = event;
    const res = await fetch(`${BASE_URI}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const createdEvent: PostEventsReturn = await res.json();

    return createdEvent;
  }

  static async putEvent(
    id: string,
    event: NonRecurringEvent,
    user: User,
  ): Promise<NonRecurringEvent> {
    const token = await user.getIdToken();

    const body: PutEventsBody = event;
    const res = await fetch(`${BASE_URI}/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const updatedEvent: PutEventsReturn = await res.json();

    return updatedEvent;
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
