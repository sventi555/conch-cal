import {
  Event,
  GetEventsQueryType,
  GetEventsReturnType,
  PostEventsReturnType,
} from 'lib';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth';
import { Calendar } from '../components/calendar/Calendar';
import {
  CreateEventModal,
  ModifyEventModal,
} from '../components/event-modals/EventModal';
import {
  MS_PER_HOUR,
  dayStringFromDate,
  setTimeBlockState,
  timeStringFromDate,
  useTimeBlock,
} from '../utils/date';

export const Home = () => {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const createEventModalRef = useRef<HTMLDialogElement>(null);
  const modifyEventModalRef = useRef<HTMLDialogElement>(null);

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

  const now = new Date();
  const hrLater = new Date(now.getTime() + MS_PER_HOUR);

  const timeBlock = useTimeBlock({
    startDay: dayStringFromDate(now),
    startTime: timeStringFromDate(now),
    endDay: dayStringFromDate(hrLater),
    endTime: timeStringFromDate(hrLater),
  });

  const [title, setTitle] = useState('');
  const [id, setId] = useState('');

  return (
    <>
      {user ? (
        <button onClick={() => logout()}>logout</button>
      ) : (
        <Link to="/login">login</Link>
      )}
      <Calendar
        events={events}
        onClickTime={(time) => {
          const date = new Date(time);
          const hrLater = new Date(time + MS_PER_HOUR);
          setTimeBlockState(timeBlock, date, hrLater);
          setTitle('New Event');

          createEventModalRef.current?.showModal();
        }}
        onClickEvent={(event) => {
          setTimeBlockState(
            timeBlock,
            new Date(event.start),
            new Date(event.end),
          );
          setTitle(event.name);
          setId(event.id);

          modifyEventModalRef.current?.showModal();
        }}
      />
      <CreateEventModal
        dialogRef={createEventModalRef}
        title={title}
        setTitle={setTitle}
        timeBlock={timeBlock}
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
      <ModifyEventModal
        id={id}
        timeBlock={timeBlock}
        title={title}
        setTitle={setTitle}
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
    </>
  );
};
