import Modal from 'react-modal';
import { useEventModalContext } from '../../state/Modal';
import { Event, EventInfo } from '../../types';
import { EventModalForm } from './form';

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
