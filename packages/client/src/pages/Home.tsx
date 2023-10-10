import {
  Event,
  EventData,
  GetEventsQueryType,
  GetEventsReturnType,
  PostEventsReturnType,
} from 'lib';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../auth';
import { Calendar } from '../components/calendar/Calendar';
import {
  CreateEventModal,
  ModifyEventModal,
} from '../components/event-modals/EventModal';
import { MS_PER_HOUR } from '../utils/date';

export const Home = () => {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const createEventModalRef = useRef<HTMLDialogElement>(null);
  const modifyEventModalRef = useRef<HTMLDialogElement>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  useEffect(() => {
    if (user) {
      user.getIdToken().then((token) => {
        const query: GetEventsQueryType = { userId: user.uid };
        const queryString = new URLSearchParams(query);
        fetch(`${import.meta.env.VITE_API_HOST}/events?${queryString}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data: GetEventsReturnType) => setEvents(data));
      });
    }
  }, [user]);

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
      {selectedEvent && (
        <CreateEventModal
          dialogRef={createEventModalRef}
          event={selectedEvent}
          setEvent={setSelectedEvent}
          onSubmit={(event) => {
            user?.getIdToken().then((token) => {
              fetch(`${import.meta.env.VITE_API_HOST}/events`, {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
              })
                .then((res) => res.json())
                .then((event: PostEventsReturnType) => {
                  setEvents([...events, event]);
                });
            });
            createEventModalRef.current?.close();
          }}
        />
      )}
      {selectedEvent && selectedId && (
        <ModifyEventModal
          id={selectedId}
          event={selectedEvent}
          setEvent={setSelectedEvent}
          dialogRef={modifyEventModalRef}
          onSubmit={(id, event) => {
            user?.getIdToken().then((token) => {
              fetch(`${import.meta.env.VITE_API_HOST}/events/${id}`, {
                method: 'PUT',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
              })
                .then((res) => res.json())
                .then((event: PostEventsReturnType) => {
                  setEvents([...events, event]);
                });
            });
            modifyEventModalRef.current?.close();
          }}
          onDelete={(id) => {
            user?.getIdToken().then((token) => {
              fetch(`${import.meta.env.VITE_API_HOST}/events/${id}`, {
                method: 'DELETE',
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }).then(() => {
                setEvents([...events.filter((event) => event.id !== id)]);
              });
            });
            modifyEventModalRef.current?.close();
          }}
        />
      )}
    </>
  );
};
