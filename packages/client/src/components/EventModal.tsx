import { EventData, PostEventsBodyType, PutEventsBodyType } from 'lib';
import {
  dateFromDayAndTime,
  dayStringFromDate,
  timeStringFromDate,
} from '../utils/date';

interface EventModalFormProps {
  event: EventData;
  setEvent: (event: EventData) => void;
}

const EventModalForm: React.FC<EventModalFormProps> = (props) => {
  const startDate = new Date(props.event.start);
  const startDay = dayStringFromDate(startDate);
  const startTime = timeStringFromDate(startDate);

  const endDate = new Date(props.event.end);
  const endDay = dayStringFromDate(endDate);
  const endTime = timeStringFromDate(endDate);
  return (
    <div>
      <div>
        <input
          value={props.event.name}
          onChange={(e) => {
            props.setEvent({ ...props.event, name: e.target.value });
          }}
        />
      </div>
      <div>
        <input
          type="date"
          value={startDay}
          min="1999-06-02"
          onChange={(e) =>
            props.setEvent({
              ...props.event,
              start: dateFromDayAndTime(e.target.value, startTime).getTime(),
            })
          }
        />
        <input
          type="time"
          value={startTime}
          onChange={(e) =>
            props.setEvent({
              ...props.event,
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
            props.setEvent({
              ...props.event,
              end: dateFromDayAndTime(e.target.value, endTime).getTime(),
            })
          }
        />
        <input
          type="time"
          value={endTime}
          onChange={(e) =>
            props.setEvent({
              ...props.event,
              end: dateFromDayAndTime(endDay, e.target.value).getTime(),
            })
          }
        />
      </div>
    </div>
  );
};

interface EventModalProps extends EventModalFormProps {
  dialogRef: React.Ref<HTMLDialogElement>;
}

interface CreateEventModalProps extends EventModalProps {
  onSubmit: (event: PostEventsBodyType) => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = (props) => {
  return (
    <dialog ref={props.dialogRef}>
      <EventModalForm {...props} />
      <div>
        <button onClick={() => props.onSubmit(props.event)}>Submit</button>
      </div>
    </dialog>
  );
};

interface ModifyEventModalProps extends EventModalProps {
  id: string;
  onSubmit: (id: string, event: PutEventsBodyType) => void;
  onDelete: (id: string) => void;
}

export const ModifyEventModal: React.FC<ModifyEventModalProps> = (props) => {
  return (
    <dialog ref={props.dialogRef}>
      <EventModalForm {...props} />
      <div>
        <button onClick={() => props.onDelete(props.id)}>Delete</button>
        <button onClick={() => props.onSubmit(props.id, props.event)}>
          Submit
        </button>
      </div>
    </dialog>
  );
};
