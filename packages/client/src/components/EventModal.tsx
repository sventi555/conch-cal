import { PostEventsBodyType } from 'lib';
import { Ref } from 'react';
import { TimeBlockState, dateFromDayAndTime } from '../utils/date';

interface EventModalProps {
  dialogRef: Ref<HTMLDialogElement>;
  onSubmit: (event: PostEventsBodyType) => void;
  timeBlock: TimeBlockState;
}

export const EventModal: React.FC<EventModalProps> = ({
  dialogRef,
  onSubmit,
  timeBlock,
}) => {
  const {
    startDay,
    startTime,
    endDay,
    endTime,
    setStartDay,
    setStartTime,
    setEndDay,
    setEndTime,
  } = timeBlock;

  return (
    <dialog ref={dialogRef}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            start: dateFromDayAndTime(startDay, startTime).getTime(),
            end: dateFromDayAndTime(endDay, endTime).getTime(),
            name: 'Biffus',
          });
        }}
      >
        <div>
          <input
            type="date"
            id="start-date"
            value={timeBlock.startDay}
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
