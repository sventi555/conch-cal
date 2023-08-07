import { useRef } from 'react';
import { Calendar } from './components/Calendar';
import { EventModal } from './components/EventModal';
import { MS_PER_HOUR } from './utils/date';

/**
 * TODO
 * - event names
 * - day markers
 * - hour marker labels
 * - don't draw out of bounds events
 */

const now = Date.now();
const lastHour = now - (now % MS_PER_HOUR);

const events = [
  {
    start: lastHour,
    end: lastHour + 3600 * 1000 * 1,
    name: 'event 1',
  },
  {
    start: lastHour + 3600 * 1000 * 2,
    end: lastHour + 3600 * 1000 * 4,
    name: 'event 2',
  },
  {
    start: lastHour + 3600 * 1000 * 12,
    end: lastHour + 3600 * 1000 * 13,
    name: 'event 3',
  },
];

export const App = () => {
  const eventModalRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Calendar events={events} />
      <EventModal dialogRef={eventModalRef} />
      <button onClick={() => eventModalRef.current?.showModal()}>
        Add Event
      </button>
    </>
  );
};
