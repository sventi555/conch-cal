import { Event, PostEventsBodyType, PutEventsBodyType } from 'lib';
import Modal from 'react-modal';
import { useEventModalContext } from '../state/modal';
import {
  dateFromDayAndTime,
  dayStringFromDate,
  timeStringFromDate,
} from '../utils/date';

export const EMPTY_EVENT: Event = {
  id: '',
  owner: '',
  name: '',
  start: 0,
  end: 0,
};

const EventModalForm: React.FC = () => {
  const { event, setEvent } = useEventModalContext();

  const startDate = new Date(event.start);
  const startDay = dayStringFromDate(startDate);
  const startTime = timeStringFromDate(startDate);

  const endDate = new Date(event.end);
  const endDay = dayStringFromDate(endDate);
  const endTime = timeStringFromDate(endDate);
  return (
    <div>
      <div>
        <input
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
              start: dateFromDayAndTime(e.target.value, startTime).getTime(),
            })
          }
        />
        <input
          type="time"
          value={startTime}
          onChange={(e) =>
            setEvent({
              ...event,
              start: dateFromDayAndTime(startDay, e.target.value).getTime(),
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
              end: dateFromDayAndTime(e.target.value, endTime).getTime(),
            })
          }
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) =>
            setEvent({
              ...event,
              end: dateFromDayAndTime(endDay, e.target.value).getTime(),
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
      <EventModalForm />
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
