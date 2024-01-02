import Modal from 'react-modal';
import { Frequency, WeekdayStr } from 'rrule';
import { useEventModalContext } from '../state/modal';
import { Event, EventInfo, Recurrence, isRecurring } from '../types';
import {
  dateFromDayAndTimeString,
  dayAndTimeStringFromDate,
} from '../utils/date';

interface EventModalFormProps {
  autoFocusNameInput?: boolean;
  onSubmit: () => void;
  actionButtons?: React.ReactNode;
}

const defaultRecurrence = (start: number): Recurrence => ({
  start,
  freq: Frequency.WEEKLY,
});

const onChangeWeekday = (
  eventInfo: EventInfo,
  setEventInfo: (eventInfo: EventInfo) => void,
  weekdayStr: WeekdayStr,
  enabled: boolean,
) => {
  if (!isRecurring(eventInfo)) {
    throw new Error('cannot update weekday without recurrence');
  }

  const weekdaysSet = new Set<WeekdayStr>(eventInfo.recurrence.byweekday || []);
  if (enabled) {
    weekdaysSet.add(weekdayStr);
  } else {
    weekdaysSet.delete(weekdayStr);
  }

  setEventInfo({
    ...eventInfo,
    recurrence: {
      ...eventInfo.recurrence,
      byweekday: Array.from(weekdaysSet),
    },
  });
};

const FREQ_MAP = {
  none: undefined,
  daily: Frequency.DAILY,
  weekly: Frequency.WEEKLY,
  monthly: Frequency.MONTHLY,
  yearly: Frequency.YEARLY,
};

const EventModalForm: React.FC<EventModalFormProps> = (props) => {
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
      <div>
        <input
          autoFocus={props.autoFocusNameInput ?? false}
          placeholder="Add title"
          value={eventInfo.name}
          onChange={(e) => {
            setEventInfo({ ...eventInfo, name: e.target.value });
          }}
        />
      </div>
      <div>
        <label>Start:</label>
        <input
          type="date"
          value={startDay}
          min="1999-06-02"
          onChange={(e) =>
            setEventInfo({
              ...eventInfo,
              start: dateFromDayAndTimeString(e.target.value, startTime),
            })
          }
        />
        <input
          type="time"
          value={startTime}
          onChange={(e) =>
            setEventInfo({
              ...eventInfo,
              start: dateFromDayAndTimeString(startDay, e.target.value),
            })
          }
        />
      </div>
      <div>
        <label>End:</label>
        <input
          type="date"
          value={endDay}
          min="1999-06-02"
          onChange={(e) =>
            setEventInfo({
              ...eventInfo,
              end: dateFromDayAndTimeString(e.target.value, endTime),
            })
          }
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) =>
            setEventInfo({
              ...eventInfo,
              end: dateFromDayAndTimeString(endDay, e.target.value),
            })
          }
        />
      </div>
      <div>
        <label>Repeats:</label>
        <select
          onChange={(e) => {
            const freq = FREQ_MAP[e.target.value as keyof typeof FREQ_MAP];
            if (freq == null) {
              setEventInfo({
                ...eventInfo,
                recurrence: undefined,
              });
            } else if (isRecurring(eventInfo)) {
              setEventInfo({
                ...eventInfo,
                recurrence: {
                  ...eventInfo.recurrence,
                  freq,
                },
              });
            } else {
              setEventInfo({
                ...eventInfo,
                recurrence: defaultRecurrence(eventInfo.start),
              });
            }
          }}
        >
          <option value="none">None</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <div>
        <label>Interval:</label>
        <input
          type="number"
          onChange={(e) => {
            if (!isRecurring(eventInfo)) {
              throw new Error('cannot update interval without recurrence');
            }

            const interval = parseInt(e.target.value);
            setEventInfo({
              ...eventInfo,
              recurrence: {
                ...eventInfo.recurrence,
                interval,
              },
            });
          }}
        />
      </div>
      <div>
        <label>By day:</label>
        <label>S</label>
        <input
          type="checkbox"
          onChange={(e) => {
            onChangeWeekday(eventInfo, setEventInfo, 'SU', e.target.checked);
          }}
        />
        <label>M</label>
        <input
          type="checkbox"
          onChange={(e) => {
            onChangeWeekday(eventInfo, setEventInfo, 'MO', e.target.checked);
          }}
        />
        <label>T</label>
        <input
          type="checkbox"
          onChange={(e) => {
            onChangeWeekday(eventInfo, setEventInfo, 'TU', e.target.checked);
          }}
        />
        <label>W</label>
        <input
          type="checkbox"
          onChange={(e) => {
            onChangeWeekday(eventInfo, setEventInfo, 'WE', e.target.checked);
          }}
        />
        <label>T</label>
        <input
          type="checkbox"
          onChange={(e) => {
            onChangeWeekday(eventInfo, setEventInfo, 'TH', e.target.checked);
          }}
        />
        <label>F</label>
        <input
          type="checkbox"
          onChange={(e) => {
            onChangeWeekday(eventInfo, setEventInfo, 'FR', e.target.checked);
          }}
        />
        <label>S</label>
        <input
          type="checkbox"
          onChange={(e) => {
            onChangeWeekday(eventInfo, setEventInfo, 'SA', e.target.checked);
          }}
        />
      </div>
      <div>
        <label>Never ends:</label>
        <input
          type="radio"
          name="ends"
          onChange={(e) => {
            if (!isRecurring(eventInfo)) {
              throw new Error('cannot update end condition without recurrence');
            }

            const checked = e.target.value;
            if (checked) {
              setEventInfo({
                ...eventInfo,
                recurrence: {
                  ...eventInfo.recurrence,
                  until: undefined,
                  count: undefined,
                },
              });
            }
          }}
        />
      </div>
      <div>
        <label>Until:</label>
        <input type="radio" name="ends" />
        <input type="date" min="1999-06-02" />
      </div>
      <div>
        <label>Count:</label>
        <input type="radio" name="ends" />
        <input type="number" />
      </div>
      {props.actionButtons}
    </form>
  );
};

interface EventModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface CreateEventModalProps extends EventModalProps {
  onSubmit: (event: EventInfo) => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = (props) => {
  const { eventInfo } = useEventModalContext();

  if (eventInfo == null) {
    return <></>;
  }

  return (
    <Modal isOpen={props.isOpen} onRequestClose={() => props.setIsOpen(false)}>
      <EventModalForm
        onSubmit={() => props.onSubmit(eventInfo)}
        actionButtons={
          <div>
            <button type="submit">Submit</button>
          </div>
        }
        autoFocusNameInput
      />
    </Modal>
  );
};

interface ModifyEventModalProps extends EventModalProps {
  onSubmit: (selectedEvent: Event, updatedInfo: EventInfo) => void;
  onDelete: (selectedEvent: Event) => void;
}

export const ModifyEventModal: React.FC<ModifyEventModalProps> = (props) => {
  const { selectedEvent, eventInfo } = useEventModalContext();

  if (selectedEvent == null || eventInfo == null) {
    return <></>;
  }

  return (
    <Modal isOpen={props.isOpen} onRequestClose={() => props.setIsOpen(false)}>
      <EventModalForm
        onSubmit={() => props.onSubmit(selectedEvent, eventInfo)}
        actionButtons={
          <div>
            <button type="button" onClick={() => props.onDelete(selectedEvent)}>
              Delete
            </button>
            <button type="submit">Submit</button>
          </div>
        }
      />
    </Modal>
  );
};
