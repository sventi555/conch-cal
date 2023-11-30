import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import './index.scss';

interface MiniCalProps {
  followFocusedTime: boolean;
  setFollowFocusedTime: (follow: boolean) => void;
  focusedTime: number;
  setFocusedTime: (time: number) => void;
}

export const MiniCal: React.FC<MiniCalProps> = (props) => {
  const [activeDate, setActiveDate] = useState(new Date(props.focusedTime));

  useEffect(() => {
    if (props.followFocusedTime) {
      setActiveDate(new Date(props.focusedTime));
    }
  }, [props.followFocusedTime, props.focusedTime]);

  return (
    <Calendar
      activeStartDate={activeDate}
      value={new Date(props.focusedTime)}
      minDetail="decade"
      formatShortWeekday={(locale, date) =>
        date.toLocaleDateString(undefined, { weekday: 'narrow' })
      }
      calendarType="gregory"
      onClickDay={(val) => {
        props.setFollowFocusedTime(true);
        props.setFocusedTime(val.getTime());
      }}
      onActiveStartDateChange={({ action, activeStartDate }) => {
        // only run this for menu nav
        if (action === 'onChange') return;

        if (activeStartDate == null) {
          throw new Error('no start date for requested view');
        }

        props.setFollowFocusedTime(false);
        setActiveDate(activeStartDate);
      }}
    />
  );
};
