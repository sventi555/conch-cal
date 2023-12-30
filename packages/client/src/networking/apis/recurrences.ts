import { User } from 'firebase/auth';
import {
  GetRecurrencesQuery,
  GetRecurrencesReturn,
  PostRecurrencesBody,
  PostRecurrencesReturn,
  PutRecurrencesBody,
  PutRecurrencesReturn,
  Recurrence,
} from 'lib';
import config from '../../config';
import { RecurringEvent, RecurringEventInfo } from '../../types';
import { toQueryString } from '../utils/query';

const BASE_URI = `${config.hosts.api}/recurrences`;

export class RecurrencesAPI {
  static async getRecurrences(
    user: User,
    before: number,
  ): Promise<RecurringEvent[]> {
    const token = await user.getIdToken();

    const query: GetRecurrencesQuery = {
      userId: user.uid,
      before,
    };
    const res = await fetch(`${BASE_URI}?${toQueryString(query)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const fetchedRecurrences: GetRecurrencesReturn = await res.json();

    return fetchedRecurrences.map((recurrence) => toRecurringEvent(recurrence));
  }

  static async postRecurrence(
    recurrence: RecurringEventInfo,
    user: User,
  ): Promise<RecurringEvent> {
    const token = await user.getIdToken();

    const body: PostRecurrencesBody = postBodyFromInfo(recurrence);
    const res = await fetch(`${BASE_URI}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const createdRecurrence: PostRecurrencesReturn = await res.json();

    return toRecurringEvent(createdRecurrence);
  }

  static async putRecurrence(
    id: string,
    recurrence: RecurringEvent,
    user: User,
  ): Promise<RecurringEvent> {
    const token = await user.getIdToken();

    const body: PutRecurrencesBody = fromRecurringEvent(recurrence);
    const res = await fetch(`${BASE_URI}/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const updatedRecurrence: PutRecurrencesReturn = await res.json();

    return toRecurringEvent(updatedRecurrence);
  }

  static async deleteRecurrence(id: string, user: User) {
    const token = await user.getIdToken();
    await fetch(`${BASE_URI}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

const postBodyFromInfo = (
  eventInfo: RecurringEventInfo,
): PostRecurrencesBody => ({ ...eventInfo.recurrence, event: eventInfo });

const toRecurringEvent = (recurrence: Recurrence): RecurringEvent => ({
  ...recurrence.event,
  id: recurrence.id,
  groupId: recurrence.groupId,
  owner: recurrence.owner,
  recurrence,
});

const fromRecurringEvent = (event: RecurringEvent): Recurrence => ({
  ...event.recurrence,
  id: event.id,
  groupId: event.groupId,
  owner: event.owner,
  event,
});
