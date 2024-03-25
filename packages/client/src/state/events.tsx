import { DateRange } from 'lib';
import {
  Dispatch,
  Reducer,
  createContext,
  useContext,
  useReducer,
} from 'react';
import { Event, NonRecurringEvent, RecurringEvent } from '../types';
import { eventInstances } from '../utils/recurrence';

type EventsState = Event[];

interface SetEventsAction {
  type: 'set';
  events: NonRecurringEvent[];
  recurringEvents: RecurringEvent[];
  loadedRange: DateRange;
}

interface AddEventAction {
  type: 'added';
  event: NonRecurringEvent;
}

interface ModifyEventAction {
  type: 'modified';
  id: string;
  updatedEvent: NonRecurringEvent;
}

interface DeleteEventAction {
  type: 'deleted';
  id: string;
}

interface AddRecurringEventAction {
  type: 'added-recurring';
  event: RecurringEvent;
  loadedRange: DateRange;
}

interface ModifyRecurringEventAction {
  type: 'modified-recurring';
  id: string;
  updatedEvent: RecurringEvent;
  loadedRange: DateRange;
}

interface DeleteRecurringEventAction {
  type: 'deleted-recurring';
  id: string;
}

type EventsAction =
  | SetEventsAction
  | AddEventAction
  | ModifyEventAction
  | DeleteEventAction
  | AddRecurringEventAction
  | ModifyRecurringEventAction
  | DeleteRecurringEventAction;

const eventsReducer: Reducer<EventsState, EventsAction> = (events, action) => {
  switch (action.type) {
    case 'set': {
      const instances = action.recurringEvents
        .map((recurrence) => eventInstances(recurrence, action.loadedRange))
        .flat();
      return [...action.events, ...instances];
    }
    case 'added':
      return [...events, action.event];
    case 'modified':
      return events.map((event) =>
        event.id === action.id ? action.updatedEvent : event,
      );
    case 'deleted':
      return events.filter((event) => event.id !== action.id);
    case 'added-recurring': {
      const instances = eventInstances(action.event, action.loadedRange);
      return [...events, ...instances];
    }
    case 'modified-recurring': {
      const instances = eventInstances(action.updatedEvent, action.loadedRange);
      return [
        ...events.filter(
          (event) => event.recurrence == null || event.id !== action.id,
        ),
        ...instances,
      ];
    }
    case 'deleted-recurring':
      return events.filter(
        (event) => event.recurrence == null || event.id !== action.id,
      );
  }
};

export type EventsDispatch = Dispatch<EventsAction>;

const EventsContext = createContext<EventsState | undefined>(undefined);
const EventsDispatchContext = createContext<EventsDispatch | undefined>(
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
