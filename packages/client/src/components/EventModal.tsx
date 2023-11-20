import { Event, PostEventsBodyType, PutEventsBodyType } from 'lib';
import { createContext, useContext } from 'react';
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

export const EventModalContext = createContext<
  | {
      event: Event;
      setEvent: (event: Event) => void;
    }
  | undefined
>(undefined);

export const useEventModalContext = () => {
  const context = useContext(EventModalContext);
  if (context === undefined) {
    throw new Error('Using event modal context without a provider');
  }

  return context;
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
  dialogRef: React.Ref<HTMLDialogElement>;
}

interface CreateEventModalProps extends EventModalProps {
  onSubmit: (event: PostEventsBodyType) => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = (props) => {
  const { event } = useEventModalContext();

  return (
    <dialog ref={props.dialogRef}>
      <EventModalForm />
      <div>
        <button onClick={() => props.onSubmit(event)}>Submit</button>
      </div>
    </dialog>
  );
};

interface ModifyEventModalProps extends EventModalProps {
  onSubmit: (id: string, event: PutEventsBodyType) => void;
  onDelete: (id: string) => void;
}

export const ModifyEventModal: React.FC<ModifyEventModalProps> = (props) => {
  const { event } = useEventModalContext();
  return (
    <dialog ref={props.dialogRef}>
      <EventModalForm />
      <div>
        <button onClick={() => props.onDelete(event.id)}>Delete</button>
        <button onClick={() => props.onSubmit(event.id, event)}>Submit</button>
      </div>
    </dialog>
  );
};

interface EventModalsProps {
  createModalDialogRef: React.Ref<HTMLDialogElement>;
  modifyModalDialogRef: React.Ref<HTMLDialogElement>;
  onCreate: CreateEventModalProps['onSubmit'];
  onModify: ModifyEventModalProps['onSubmit'];
  onDelete: ModifyEventModalProps['onDelete'];
}

export const EventModals: React.FC<EventModalsProps> = (props) => {
  return (
    <>
      <CreateEventModal
        dialogRef={props.createModalDialogRef}
        onSubmit={props.onCreate}
      />
      <ModifyEventModal
        dialogRef={props.modifyModalDialogRef}
        onSubmit={props.onModify}
        onDelete={props.onDelete}
      />
    </>
  );
};
