import { useState } from 'react';
import { useAuth } from '../auth';
import { CreateEventModal, ModifyEventModal } from '../components/EventModal';
import { Calendar } from '../components/calendar/Calendar';
import { MiniCal } from '../components/mini-cal';
import { EventsAPI } from '../networking/apis/events';
import { useLoadEvents } from '../networking/load-events';
import { useEvents, useEventsDispatch } from '../state/events';
import { useMiniCalContext } from '../state/mini-cal';
import { useEventModalContext } from '../state/modal';
import { MS_PER_HOUR, roundTo15Min } from '../utils/date';

export const Home = () => {
  const { user, logout } = useAuth();

  useLoadEvents();
  const events = useEvents();
  const dispatch = useEventsDispatch();

  const { setEvent } = useEventModalContext();
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [isModifyEventModalOpen, setIsModifyEventModalOpen] = useState(false);

  const { setFollowFocusedTime } = useMiniCalContext();

  const [focusedTime, setFocusedTime] = useState(Date.now());

  if (!user) {
    return;
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
          <MiniCal focusedTime={focusedTime} setFocusedTime={setFocusedTime} />
          <button
            onClick={() => {
              setFollowFocusedTime(true);
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
            setEvent({
              id: '',
              owner: user.uid,
              name: '',
              start: snappedTime,
              end: snappedTime + MS_PER_HOUR,
            });

            setIsCreateEventModalOpen(true);
          }}
          onClickEvent={(event) => {
            setEvent(event);

            setIsModifyEventModalOpen(true);
          }}
        />
      </div>
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
