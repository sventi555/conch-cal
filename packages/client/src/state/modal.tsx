import { Event } from 'lib';
import { createContext, useContext } from 'react';

export const EventModalContext = createContext<
  | {
      event: Event;
      setEvent: (event: Event) => void;
    }
  | undefined
>(undefined);

export const useEventModalContext = () => {
  const context = useContext(EventModalContext);
  if (context === undefined) {
    throw new Error('Using event modal context without a provider');
  }

  return context;
};
