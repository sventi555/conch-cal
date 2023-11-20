import { GetEventsReturnType } from 'lib';
import { useEffect } from 'react';
import { useAuth } from '../auth';
import { useEventsDispatch } from '../state/events';
import { EventsAPI } from './apis/events';

export const useLoadEvents = () => {
  const { user } = useAuth();
  const dispatch = useEventsDispatch();

  useEffect(() => {
    if (user) {
      EventsAPI.getEvents(user).then((data: GetEventsReturnType) =>
        dispatch({ type: 'set', events: data }),
      );
    }
  }, [dispatch, user]);
};
