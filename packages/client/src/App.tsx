import { useRef, useState } from 'react';
import { Calendar } from './components/Calendar';
import { CalendarEvent } from './components/Event';
import { EventModal } from './components/EventModal';
import { dayFromDate, timeFromDate, useTimeBlock } from './utils/date';

/**
 * TODO
 * - feed the times into the event modal
 * - day markers
 * -
 */

export const App = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const eventModalRef = useRef<HTMLDialogElement>(null);

  const now = new Date();
  const hrLater = new Date(now.getTime() + 3600 * 1000);

  const timeBlock = useTimeBlock({
    startDay: dayFromDate(now),
    startTime: timeFromDate(now),
    endDay: dayFromDate(hrLater),
    endTime: timeFromDate(hrLater),
  });

  return (
    <>
      <Calendar events={events} />
      <EventModal
        timeBlock={timeBlock}
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
