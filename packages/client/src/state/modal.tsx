import { createContext, useContext, useState } from 'react';
import { BaseEvent, Recurrence } from '../types';

export interface ModalEventInfo extends BaseEvent {
  recurrence?: Omit<Recurrence, 'id' | 'groupId'>;
}

export const EMPTY_MODAL_EVENT: ModalEventInfo = {
  owner: '',
  name: '',
  start: 0,
  end: 0,
};

interface EventModalContextState {
  event: ModalEventInfo;
  setEvent: (event: ModalEventInfo) => void;
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
  const [event, setEvent] = useState(EMPTY_MODAL_EVENT);

  return (
    <EventModalContext.Provider value={{ event, setEvent }}>
      {props.children}
    </EventModalContext.Provider>
  );
};
