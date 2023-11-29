import { Event } from 'lib';
import { createContext, useContext, useState } from 'react';
import { EMPTY_EVENT } from '../components/EventModal';

interface EventModalContextState {
  event: Event;
  setEvent: (event: Event) => void;
}

export const EventModalContext = createContext<
  EventModalContextState | undefined
>(undefined);

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
  const [event, setEvent] = useState(EMPTY_EVENT);

  return (
    <EventModalContext.Provider value={{ event, setEvent }}>
      {props.children}
    </EventModalContext.Provider>
  );
};
