import { User } from 'firebase/auth';
import { Event, GetEventsReturnType } from 'lib';
import { useEffect, useState } from 'react';
import { ConchAPI } from '../networking/conch-api';

export const useEvents = (user?: User) => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (user) {
      ConchAPI.getEvents(user).then((data: GetEventsReturnType) =>
        setEvents(data),
      );
    }
  }, [user]);

  return { events, setEvents };
};
