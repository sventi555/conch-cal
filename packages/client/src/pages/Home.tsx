import { User } from 'firebase/auth';
import { DateRange } from 'lib';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { Calendar } from '../components/calendar/Calendar';
import { CreateEventModal, ModifyEventModal } from '../components/event-modal';
import { MiniCal } from '../components/mini-cal';
import { EventsAPI } from '../networking/apis/events';
import { useLoadEvents } from '../networking/load-events';
import { useCalendarDispatch } from '../state/Calendar';
import { EventsDispatch, useEventsDispatch } from '../state/Events';
import { useEventModalContext } from '../state/Modal';
import { Event, EventInfo, isRecurring } from '../types';
import { MS_PER_HOUR, roundTo15Min } from '../utils/date';

export const Home = () => {
  const { user, logout } = useAuth();

  const eventsDispatch = useEventsDispatch();
  const calendarDispatch = useCalendarDispatch();

  const { setSelectedEvent, setEventInfo } = useEventModalContext();
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [isModifyEventModalOpen, setIsModifyEventModalOpen] = useState(false);

  const loadedRange = useLoadEvents();

  useEffect(() => {});

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
          <MiniCal />
          <button
            onClick={() => {
              calendarDispatch({ type: 'lock-to-live' });
            }}
          >
            NOW
          </button>
        </div>
        <Calendar
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
          handleAddEvent(eventInfo, user, loadedRange, eventsDispatch);
          setIsCreateEventModalOpen(false);
        }}
      />
      <ModifyEventModal
        isOpen={isModifyEventModalOpen}
        setIsOpen={setIsModifyEventModalOpen}
        onSubmit={(selectedEvent, updatedInfo) => {
          handleModifyEvent(
            selectedEvent,
            updatedInfo,
            user,
            loadedRange,
            eventsDispatch,
          );
          setIsModifyEventModalOpen(false);
        }}
        onDelete={(event) => {
          handleDeleteEvent(event, user, eventsDispatch);
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
  EventsAPI.postEvent(eventInfo, user).then((event) => {
    if (isRecurring(event)) {
      dispatch({
        type: 'added-recurring',
        event,
        loadedRange: loadedRange,
      });
    } else {
      dispatch({ type: 'added', event });
    }
  });
};

const handleModifyEvent = (
  event: Event,
  updatedInfo: EventInfo,
  user: User,
  loadedRange: DateRange,
  dispatch: EventsDispatch,
) => {
  EventsAPI.putEvent(event.id, updatedInfo, user).then((updatedEvent) => {
    if (isRecurring(updatedEvent)) {
      if (isRecurring(event)) {
        // modify recurrence
        dispatch({
          type: 'modified-recurring',
          id: event.id,
          updatedEvent,
          loadedRange,
        });
      } else {
        // convert event to recurrence
        dispatch({
          type: 'deleted',
          id: event.id,
        });
        dispatch({
          type: 'added-recurring',
          event: updatedEvent,
          loadedRange,
        });
      }
    } else {
      if (isRecurring(event)) {
        // convert recurrence to event
        dispatch({
          type: 'deleted-recurring',
          id: event.id,
        });
        dispatch({
          type: 'added',
          event: updatedEvent,
        });
      } else {
        // modify event
        dispatch({ type: 'modified', id: event.id, updatedEvent });
      }
    }
  });
};

const handleDeleteEvent = (
  event: Event,
  user: User,
  dispatch: EventsDispatch,
) => {
  EventsAPI.deleteEvent(event.id, user).then(() => {
    if (isRecurring(event)) {
      dispatch({ type: 'deleted-recurring', id: event.id });
    } else {
      dispatch({ type: 'deleted', id: event.id });
    }
  });
};
