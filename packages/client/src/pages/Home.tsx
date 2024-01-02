import { User } from 'firebase/auth';
import { DateRange } from 'lib';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { Calendar } from '../components/calendar/Calendar';
import { CreateEventModal, ModifyEventModal } from '../components/event-modal';
import { MiniCal } from '../components/mini-cal';
import { EventsAPI } from '../networking/apis/events';
import { RecurrencesAPI } from '../networking/apis/recurrences';
import { useLoadEvents } from '../networking/load-events';
import { EventsDispatch, useEvents, useEventsDispatch } from '../state/events';
import { useEventModalContext } from '../state/modal';
import { Event, EventInfo, isRecurring } from '../types';
import { MS_PER_HOUR, roundTo15Min } from '../utils/date';

export const Home = () => {
  const { user, logout } = useAuth();

  const events = useEvents();
  const dispatch = useEventsDispatch();

  const { setSelectedEvent, setEventInfo } = useEventModalContext();
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [isModifyEventModalOpen, setIsModifyEventModalOpen] = useState(false);

  const [miniCalFollowFocusedTime, setMiniCalFollowFocusedTime] =
    useState(true);

  const [focusedTime, setFocusedTime] = useState(Date.now());
  const loadedRange = useLoadEvents(focusedTime);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (loadedRange == null) {
    return <></>;
  }

  return (
    <>
      <div className="flex">
        <button className="ml-auto" onClick={() => logout()}>
          logout
        </button>
      </div>
      <div className="flex">
        <div>
          <MiniCal
            followFocusedTime={miniCalFollowFocusedTime}
            setFollowFocusedTime={setMiniCalFollowFocusedTime}
            focusedTime={focusedTime}
            setFocusedTime={setFocusedTime}
          />
          <button
            onClick={() => {
              setMiniCalFollowFocusedTime(true);
              setFocusedTime(Date.now());
            }}
          >
            NOW
          </button>
        </div>
        <Calendar
          focusedTime={focusedTime}
          setFocusedTime={setFocusedTime}
          events={events}
          onClickTime={(time) => {
            const snappedTime = roundTo15Min(time);
            setSelectedEvent(null);
            setEventInfo({
              name: '',
              owner: user.uid,
              start: snappedTime,
              end: snappedTime + MS_PER_HOUR,
            });
            setIsCreateEventModalOpen(true);
          }}
          onClickEvent={(event) => {
            setSelectedEvent(event);
            setEventInfo(event);
            setIsModifyEventModalOpen(true);
          }}
        />
      </div>
      <CreateEventModal
        isOpen={isCreateEventModalOpen}
        setIsOpen={setIsCreateEventModalOpen}
        onSubmit={(eventInfo) => {
          handleAddEvent(eventInfo, user, loadedRange, dispatch);
          setIsCreateEventModalOpen(false);
        }}
      />
      <ModifyEventModal
        isOpen={isModifyEventModalOpen}
        setIsOpen={setIsModifyEventModalOpen}
        onSubmit={(event) => {
          handleModifyEvent(event, user, loadedRange, dispatch);
          setIsModifyEventModalOpen(false);
        }}
        onDelete={(event) => {
          handleDeleteEvent(event, user, dispatch);
          setIsModifyEventModalOpen(false);
        }}
      />
    </>
  );
};

const handleAddEvent = (
  eventInfo: EventInfo,
  user: User,
  loadedRange: DateRange,
  dispatch: EventsDispatch,
) => {
  if (isRecurring(eventInfo)) {
    RecurrencesAPI.postRecurrence(eventInfo, user).then((recurrence) => {
      dispatch({
        type: 'added-recurring',
        event: recurrence,
        loadedRange: loadedRange,
      });
    });
  } else {
    EventsAPI.postEvent(eventInfo, user).then((event) => {
      dispatch({ type: 'added', event });
    });
  }
};

const handleModifyEvent = (
  event: Event,
  user: User,
  loadedRange: DateRange,
  dispatch: EventsDispatch,
) => {
  if (isRecurring(event)) {
    RecurrencesAPI.putRecurrence(event.id, event, user).then((recurrence) => {
      dispatch({
        type: 'modified-recurring',
        id: event.id,
        updatedEvent: recurrence,
        loadedRange: loadedRange,
      });
    });
  } else {
    const id = event.id;
    EventsAPI.putEvent(id, event, user).then((event) =>
      dispatch({ type: 'modified', id, updatedEvent: event }),
    );
  }
};

const handleDeleteEvent = (
  event: Event,
  user: User,
  dispatch: EventsDispatch,
) => {
  if (isRecurring(event)) {
    RecurrencesAPI.deleteRecurrence(event.id, user).then(() =>
      dispatch({ type: 'deleted-recurring', id: event.id }),
    );
  } else {
    const id = event.id;
    EventsAPI.deleteEvent(id, user).then(() => {
      dispatch({ type: 'deleted', id });
    });
  }
};
