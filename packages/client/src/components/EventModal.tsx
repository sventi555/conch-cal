import { Ref, useState } from 'react';
import { CalendarEvent } from './Event';

interface EventModalProps {
  dialogRef: Ref<HTMLDialogElement>;
  onSubmit: (event: CalendarEvent) => void;
}

export const EventModal = ({ dialogRef, onSubmit }: EventModalProps) => {
  const [startDay, setStartDay] = useState('2023-06-08');
  const [startTime, setStartTime] = useState('12:00');
  const [endDay, setEndDay] = useState('2023-06-08');
  const [endTime, setEndTime] = useState('13:00');

  return (
    <dialog ref={dialogRef}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            start: new Date(`${startDay}T${startTime}`).getTime(),
            end: new Date(`${endDay}T${endTime}`).getTime(),
            name: 'Biffus',
          });
        }}
      >
        <div>
          <input
            type="date"
            id="start-date"
            value={startDay}
            min="1999-06-02"
            onChange={(e) => setStartDay(e.target.value)}
          />
          <input
            type="time"
            id="start-time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div>
          <input
            type="date"
            id="end-date"
            value={endDay}
            min="1999-06-02"
            onChange={(e) => setEndDay(e.target.value)}
          />
          <input
            type="time"
            id="end-time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
        <input type="submit" value="Add Event" />
      </form>
    </dialog>
  );
};
