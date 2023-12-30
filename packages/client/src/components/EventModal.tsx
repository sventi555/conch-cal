import Modal from 'react-modal';
import { Frequency } from 'rrule';
import { useEventModalContext } from '../state/modal';
import { Event, EventInfo } from '../types';
import {
  dateFromDayAndTimeString,
  dayAndTimeStringFromDate,
} from '../utils/date';

interface EventModalFormProps {
  autoFocusNameInput?: boolean;
  onSubmit: () => void;
  actionButtons?: React.ReactNode;
}

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
            } else {
              // TODO better way of getting defaults for recurrence. maybe we have DEFAULT_RECURRENCE?
              setEventInfo({
                ...eventInfo,
                recurrence: {
                  start: eventInfo.start,
                  freq,
                },
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
        <input type="number" />
      </div>
      <div>
        <label>By day:</label>
        <label>S</label>
        <input type="checkbox" />
        <label>M</label>
        <input type="checkbox" />
        <label>T</label>
        <input type="checkbox" />
        <label>W</label>
        <input type="checkbox" />
        <label>T</label>
        <input type="checkbox" />
        <label>F</label>
        <input type="checkbox" />
        <label>S</label>
        <input type="checkbox" />
      </div>
      <div>
        <label>Never ends:</label>
        <input type="radio" name="ends" />
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
