import { useRef, useState } from 'react';
import { Calendar } from './components/Calendar';
import { CalendarEvent } from './components/Event';
import { EventModal } from './components/EventModal';

/**
 * TODO
 * - feed the times into the event modal
 * - day markers
 * -
 */

export const App = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const eventModalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Calendar events={events} />
      <EventModal
        dialogRef={eventModalRef}
        onSubmit={(event: CalendarEvent) => {
          setEvents([...events, event]);
          eventModalRef.current?.close();
        }}
      />
      <button onClick={() => eventModalRef.current?.showModal()}>
        Add Event
      </button>
    </>
  );
};
