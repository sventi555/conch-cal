import {
  Event,
  GetEventsQueryType,
  GetEventsReturnType,
  PostEventsReturnType,
} from 'lib';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth';
import { EventModal } from '../components/EventModal';
import { Calendar } from '../components/calendar/Calendar';
import {
  MS_PER_HOUR,
  dayStringFromDate,
  timeStringFromDate,
  useTimeBlock,
} from '../utils/date';

export const Home = () => {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const eventModalRef = useRef<HTMLDialogElement>(null);

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
          if (eventModalRef.current?.open) {
            return;
          }

          const date = new Date(time);
          const hrLater = new Date(time + MS_PER_HOUR);

          timeBlock.setStartDay(dayStringFromDate(date));
          timeBlock.setStartTime(timeStringFromDate(date));
          timeBlock.setEndDay(dayStringFromDate(hrLater));
          timeBlock.setEndTime(timeStringFromDate(hrLater));

          eventModalRef.current?.showModal();
        }}
      />
      <EventModal
        timeBlock={timeBlock}
        dialogRef={eventModalRef}
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

          eventModalRef.current?.close();
        }}
      />
    </>
  );
};
