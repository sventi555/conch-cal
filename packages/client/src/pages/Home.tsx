import { EventData } from 'lib';
import { useRef, useState } from 'react';
import { useAuth } from '../auth';
import { Calendar } from '../components/calendar/Calendar';
import {
  CreateEventModal,
  ModifyEventModal,
} from '../components/event-modals/EventModal';
import { useEvents } from '../hooks/use-events';
import { ConchAPI } from '../networking/conch-api';
import { MS_PER_HOUR } from '../utils/date';

export const Home = () => {
  const { user, logout } = useAuth();
  const { events, setEvents } = useEvents(user);
  const createEventModalRef = useRef<HTMLDialogElement>(null);
  const modifyEventModalRef = useRef<HTMLDialogElement>(null);

  const [selectedId, setSelectedId] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<EventData>({
    owner: '',
    name: '',
    start: 0,
    end: 0,
  });

  if (!user) {
    return;
  }

  return (
    <>
      <button onClick={() => logout()}>logout</button>
      <Calendar
        events={events}
        onClickTime={(time) => {
          setSelectedEvent({
            name: 'New Event',
            start: new Date(time).getTime(),
            end: new Date(time + MS_PER_HOUR).getTime(),
            owner: user.uid,
          });

          createEventModalRef.current?.showModal();
        }}
        onClickEvent={(event) => {
          setSelectedEvent({ ...event });
          setSelectedId(event.id);

          modifyEventModalRef.current?.showModal();
        }}
      />
      <CreateEventModal
        dialogRef={createEventModalRef}
        event={selectedEvent}
        setEvent={setSelectedEvent}
        onSubmit={(event) => {
          ConchAPI.postEvent(event, user).then((event) => {
            setEvents([...events, event]);
          });
          createEventModalRef.current?.close();
        }}
      />
      <ModifyEventModal
        id={selectedId}
        event={selectedEvent}
        setEvent={setSelectedEvent}
        dialogRef={modifyEventModalRef}
        onSubmit={(id, event) => {
          ConchAPI.putEvent(id, event, user).then((event) =>
            setEvents([...events, event]),
          );
          modifyEventModalRef.current?.close();
        }}
        onDelete={(id) => {
          ConchAPI.deleteEvent(id, user).then(() => {
            setEvents([...events.filter((event) => event.id !== id)]);
          });
          modifyEventModalRef.current?.close();
        }}
      />
    </>
  );
};
