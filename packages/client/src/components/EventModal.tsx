import { Event, PostEventsBodyType, PutEventsBodyType } from 'lib';
import Modal from 'react-modal';
import { useEventModalContext } from '../state/modal';
import {
  dateFromDayAndTimeString,
  dayAndTimeStringFromDate,
} from '../utils/date';

export const EMPTY_EVENT: Event = {
  id: '',
  owner: '',
  name: '',
  start: 0,
  end: 0,
};

interface EventModalFormProps {
  autoFocusNameInput?: boolean;
}

const EventModalForm: React.FC<EventModalFormProps> = ({
  autoFocusNameInput,
}) => {
  const { event, setEvent } = useEventModalContext();

  const { start, end } = event;
  const { day: startDay, time: startTime } = dayAndTimeStringFromDate(start);
  const { day: endDay, time: endTime } = dayAndTimeStringFromDate(end);

  return (
    <div>
      <div>
        <input
          autoFocus={autoFocusNameInput ?? false}
          placeholder="Add title"
          value={event.name}
          onChange={(e) => {
            setEvent({ ...event, name: e.target.value });
          }}
        />
      </div>
      <div>
        <input
          type="date"
          value={startDay}
          min="1999-06-02"
          onChange={(e) =>
            setEvent({
              ...event,
              start: dateFromDayAndTimeString(e.target.value, startTime),
            })
          }
        />
        <input
          type="time"
          value={startTime}
          onChange={(e) =>
            setEvent({
              ...event,
              start: dateFromDayAndTimeString(startDay, e.target.value),
            })
          }
        />
      </div>
      <div>
        <input
          type="date"
          value={endDay}
          min="1999-06-02"
          onChange={(e) =>
            setEvent({
              ...event,
              end: dateFromDayAndTimeString(e.target.value, endTime),
            })
          }
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) =>
            setEvent({
              ...event,
              end: dateFromDayAndTimeString(endDay, e.target.value),
            })
          }
        />
      </div>
    </div>
  );
};

interface EventModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface CreateEventModalProps extends EventModalProps {
  onSubmit: (event: PostEventsBodyType) => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = (props) => {
  const { event } = useEventModalContext();

  return (
    <Modal isOpen={props.isOpen} onRequestClose={() => props.setIsOpen(false)}>
      <EventModalForm autoFocusNameInput />
      <div>
        <button onClick={() => props.onSubmit(event)}>Submit</button>
      </div>
    </Modal>
  );
};

interface ModifyEventModalProps extends EventModalProps {
  onSubmit: (id: string, event: PutEventsBodyType) => void;
  onDelete: (id: string) => void;
}

export const ModifyEventModal: React.FC<ModifyEventModalProps> = (props) => {
  const { event } = useEventModalContext();
  return (
    <Modal isOpen={props.isOpen} onRequestClose={() => props.setIsOpen(false)}>
      <EventModalForm />
      <div>
        <button onClick={() => props.onDelete(event.id)}>Delete</button>
        <button onClick={() => props.onSubmit(event.id, event)}>Submit</button>
      </div>
    </Modal>
  );
};
