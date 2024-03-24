import { useEventModalContext } from '../../state/Modal';
import {
  dateFromDayAndTimeString,
  dayAndTimeStringFromDate,
} from '../../utils/date';
import { DateTime } from './date-time';
import { RecurrenceForm } from './recurrence';
import { TextInput } from './text';

interface EventModalFormProps {
  autoFocusNameInput?: boolean;
  onSubmit: () => void;
  actionButtons?: React.ReactNode;
}

export const EventModalForm: React.FC<EventModalFormProps> = (props) => {
  const { eventInfo, setEventInfo } = useEventModalContext();

  if (eventInfo == null) {
    throw new Error('attempted to open modal before setting event info');
  }

  const { start, end } = eventInfo;
  const { day: startDay, time: startTime } = dayAndTimeStringFromDate(start);
  const { day: endDay, time: endTime } = dayAndTimeStringFromDate(end);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit();
      }}
    >
      <TextInput
        text={eventInfo.name}
        onChange={(name) => setEventInfo({ ...eventInfo, name })}
      />
      <DateTime
        label="Start"
        day={startDay}
        onChangeDay={(day) =>
          setEventInfo({
            ...eventInfo,
            start: dateFromDayAndTimeString(day, startTime),
          })
        }
        time={startTime}
        onChangeTime={(time) =>
          setEventInfo({
            ...eventInfo,
            start: dateFromDayAndTimeString(startDay, time),
          })
        }
      />
      <DateTime
        label="End"
        day={endDay}
        onChangeDay={(day) =>
          setEventInfo({
            ...eventInfo,
            end: dateFromDayAndTimeString(day, endTime),
          })
        }
        time={endTime}
        onChangeTime={(time) =>
          setEventInfo({
            ...eventInfo,
            end: dateFromDayAndTimeString(endDay, time),
          })
        }
      />
      <RecurrenceForm
        eventStart={eventInfo.start}
        recurrence={eventInfo.recurrence}
        onChangeRecurrence={(recurrence) =>
          setEventInfo({ ...eventInfo, recurrence })
        }
      />
      {props.actionButtons}
    </form>
  );
};
