import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { useCalendar, useCalendarDispatch } from '../../state/Calendar';
import './index.scss';

export const MiniCal: React.FC = () => {
  const { focusedTime, isLive } = useCalendar();
  const calendarDispatch = useCalendarDispatch();
  const [activeDate, setActiveDate] = useState(new Date(focusedTime));
  const [followFocusedTime, setFollowFocusedTime] = useState(true);

  useEffect(() => {
    if (isLive || followFocusedTime) {
      setActiveDate(new Date(focusedTime));
    }
  }, [isLive, followFocusedTime, focusedTime]);

  return (
    <Calendar
      activeStartDate={activeDate}
      value={new Date(focusedTime)}
      minDetail="decade"
      formatShortWeekday={(locale, date) =>
        date.toLocaleDateString(undefined, { weekday: 'narrow' })
      }
      calendarType="gregory"
      onClickDay={(val) => {
        setFollowFocusedTime(true);
        calendarDispatch({ type: 'set-focus', time: val.getTime() });
      }}
      onActiveStartDateChange={({ action, activeStartDate }) => {
        // only run this for menu nav
        if (action === 'onChange') return;

        if (activeStartDate == null) {
          throw new Error('no start date for requested view');
        }

        setFollowFocusedTime(false);
        setActiveDate(activeStartDate);
      }}
    />
  );
};
