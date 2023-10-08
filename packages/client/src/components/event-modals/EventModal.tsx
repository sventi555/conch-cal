import { PostEventsBodyType, PutEventsBodyType } from 'lib';
import { TimeBlockState, dateFromDayAndTime } from '../../utils/date';

interface EventModalFormProps {
  title: string;
  setTitle: (title: string) => void;
  timeBlock: TimeBlockState;
}

const EventModalForm: React.FC<EventModalFormProps> = (props) => {
  return (
    <div>
      <div>
        <input
          value={props.title}
          onChange={(event) => {
            props.setTitle(event.target.value);
          }}
        />
      </div>
      <div>
        <input
          type="date"
          value={props.timeBlock.startDay}
          min="1999-06-02"
          onChange={(e) => props.timeBlock.setStartDay(e.target.value)}
        />
        <input
          type="time"
          value={props.timeBlock.startTime}
          onChange={(e) => props.timeBlock.setStartTime(e.target.value)}
        />
      </div>
      <div>
        <input
          type="date"
          value={props.timeBlock.endDay}
          min="1999-06-02"
          onChange={(e) => props.timeBlock.setEndDay(e.target.value)}
        />
        <input
          type="time"
          value={props.timeBlock.endTime}
          onChange={(e) => props.timeBlock.setEndTime(e.target.value)}
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
        <button
          onClick={() =>
            props.onSubmit({
              start: dateFromDayAndTime(
                props.timeBlock.startDay,
                props.timeBlock.startTime,
              ).getTime(),
              end: dateFromDayAndTime(
                props.timeBlock.endDay,
                props.timeBlock.endTime,
              ).getTime(),
              name: props.title,
            })
          }
        >
          Submit
        </button>
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
        <button
          onClick={() =>
            props.onSubmit(props.id, {
              start: dateFromDayAndTime(
                props.timeBlock.startDay,
                props.timeBlock.startTime,
              ).getTime(),
              end: dateFromDayAndTime(
                props.timeBlock.endDay,
                props.timeBlock.endTime,
              ).getTime(),
              name: props.title,
            })
          }
        >
          Submit
        </button>
      </div>
    </dialog>
  );
};
