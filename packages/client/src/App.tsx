import { useRef, useState } from 'react';
import { Calendar } from './components/Calendar';
import { CalendarEvent } from './components/Event';
import { EventModal } from './components/EventModal';
import {
  MS_PER_HOUR,
  dayStringFromDate,
  timeStringFromDate,
  useTimeBlock,
} from './utils/date';

/**
 * TODO
 * - use React.FC
 * - day markers
 * - move config into zustand store, and maybe time block state?
 * - division lines?
 * - better handling of click events when modal is open v closed
 * -
 */

export const App = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const eventModalRef = useRef<HTMLDialogElement>(null);

  const now = new Date();
  const hrLater = new Date(now.getTime() + MS_PER_HOUR);

  const timeBlock = useTimeBlock({
    startDay: dayStringFromDate(now),
    startTime: timeStringFromDate(now),
    endDay: dayStringFromDate(hrLater),
    endTime: timeStringFromDate(hrLater),
  });

  return (
    <>
      <Calendar
        events={events}
        onClickTime={(time) => {
          if (eventModalRef.current?.open) {
            return;
          }

          const date = new Date(time);
          const hrLater = new Date(time + MS_PER_HOUR);

          timeBlock.setStartDay(dayStringFromDate(date));
          timeBlock.setStartTime(timeStringFromDate(date));
          timeBlock.setEndDay(dayStringFromDate(hrLater));
          timeBlock.setEndTime(timeStringFromDate(hrLater));

          eventModalRef.current?.showModal();
        }}
      />
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
