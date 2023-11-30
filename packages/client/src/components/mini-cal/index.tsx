import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import './index.scss';

interface MiniCalProps {
  focusedTime: number;
  setFocusedTime: (time: number) => void;
}

export const MiniCal: React.FC<MiniCalProps> = (props) => {
  const [activeDate, setActiveDate] = useState(new Date(props.focusedTime));
  const [followFocusedTime, setFollowFocusedTime] = useState(true);

  useEffect(() => {
    if (followFocusedTime) {
      setActiveDate(new Date(props.focusedTime));
    }
  }, [followFocusedTime, props.focusedTime]);

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
        setFollowFocusedTime(true);
        props.setFocusedTime(val.getTime());
      }}
      onClickMonth={(val) => {
        setFollowFocusedTime(false);
        setActiveDate(val);
      }}
      onClickYear={(val) => {
        setFollowFocusedTime(false);
        setActiveDate(val);
      }}
    />
  );
};
