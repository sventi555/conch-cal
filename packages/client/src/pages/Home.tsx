import { useState } from 'react';
import { useAuth } from '../auth';
import { CreateEventModal, ModifyEventModal } from '../components/EventModal';
import { Calendar } from '../components/calendar/Calendar';
import { EventsAPI } from '../networking/apis/events';
import { useLoadEvents } from '../networking/load-events';
import { useEvents, useEventsDispatch } from '../state/events';
import { useEventModalContext } from '../state/modal';
import { MS_PER_HOUR } from '../utils/date';

export const Home = () => {
  const { user, logout } = useAuth();
  useLoadEvents();
  const events = useEvents();
  const dispatch = useEventsDispatch();

  const { setEvent } = useEventModalContext();
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [isModifyEventModalOpen, setIsModifyEventModalOpen] = useState(false);

  if (!user) {
    return;
  }

  return (
    <>
      <button onClick={() => logout()}>logout</button>
      <Calendar
        events={events}
        onClickTime={(time) => {
          setEvent({
            id: '',
            owner: user.uid,
            name: 'New Event',
            start: new Date(time).getTime(),
            end: new Date(time + MS_PER_HOUR).getTime(),
          });

          setIsCreateEventModalOpen(true);
        }}
        onClickEvent={(event) => {
          setEvent(event);

          setIsModifyEventModalOpen(true);
        }}
      />
      <CreateEventModal
        isOpen={isCreateEventModalOpen}
        setIsOpen={setIsCreateEventModalOpen}
        onSubmit={(event) => {
          EventsAPI.postEvent(event, user).then((event) => {
            dispatch({ type: 'added', event });
          });
          setIsCreateEventModalOpen(false);
        }}
      />
      <ModifyEventModal
        isOpen={isModifyEventModalOpen}
        setIsOpen={setIsModifyEventModalOpen}
        onSubmit={(id, event) => {
          EventsAPI.putEvent(id, event, user).then((event) =>
            dispatch({ type: 'modified', id, updatedEvent: event }),
          );
          setIsModifyEventModalOpen(false);
        }}
        onDelete={(id) => {
          EventsAPI.deleteEvent(id, user).then(() => {
            dispatch({ type: 'deleted', id });
          });
          setIsModifyEventModalOpen(false);
        }}
      />
    </>
  );
};
