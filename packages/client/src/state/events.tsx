import { Event } from 'lib';
import {
  Dispatch,
  Reducer,
  createContext,
  useContext,
  useReducer,
} from 'react';

interface SetEventsAction {
  type: 'set';
  events: Event[];
}

interface AddEventAction {
  type: 'added';
  event: Event;
}

interface ModifyEventAction {
  type: 'modified';
  id: string;
  updatedEvent: Event;
}

interface DeleteEventAction {
  type: 'deleted';
  id: string;
}

type EventsAction =
  | SetEventsAction
  | AddEventAction
  | ModifyEventAction
  | DeleteEventAction;

const eventsReducer: Reducer<Event[], EventsAction> = (events, action) => {
  switch (action.type) {
    case 'set':
      return action.events;
    case 'added':
      return [...events, action.event];
    case 'modified':
      return events.map((event) =>
        event.id === action.id ? action.updatedEvent : event,
      );
    case 'deleted':
      return events.filter((event) => event.id !== action.id);
  }
};

const EventsContext = createContext<Event[] | undefined>(undefined);
const EventsDispatchContext = createContext<Dispatch<EventsAction> | undefined>(
  undefined,
);

export const EventsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [events, dispatch] = useReducer(eventsReducer, []);

  return (
    <EventsContext.Provider value={events}>
      <EventsDispatchContext.Provider value={dispatch}>
        {children}
      </EventsDispatchContext.Provider>
    </EventsContext.Provider>
  );
};

export const useEvents = () => {
  const events = useContext(EventsContext);
  if (events === undefined) {
    throw new Error('Using events context without a provider');
  }

  return events;
};

export const useEventsDispatch = () => {
  const dispatch = useContext(EventsDispatchContext);
  if (dispatch === undefined) {
    throw new Error('Using events dispatch context without a provider');
  }

  return dispatch;
};
