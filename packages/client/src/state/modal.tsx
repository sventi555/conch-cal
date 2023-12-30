import { createContext, useContext, useState } from 'react';
import { Event, EventInfo } from '../types';

interface EventModalContextState {
  selectedEvent: Event | null;
  setSelectedEvent: (id: Event | null) => void;
  eventInfo: EventInfo | null;
  setEventInfo: (event: EventInfo | null) => void;
}

const EventModalContext = createContext<EventModalContextState | undefined>(
  undefined,
);

export const useEventModalContext = () => {
  const context = useContext(EventModalContext);
  if (context === undefined) {
    throw new Error('Using event modal context without a provider');
  }

  return context;
};

export const EventModalProvider: React.FC<React.PropsWithChildren> = (
  props,
) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventInfo, setEventInfo] = useState<EventInfo | null>(null);

  return (
    <EventModalContext.Provider
      value={{ selectedEvent, setSelectedEvent, eventInfo, setEventInfo }}
    >
      {props.children}
    </EventModalContext.Provider>
  );
};
