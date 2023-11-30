import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { useMiniCalContext } from '../../state/mini-cal';
import './index.scss';

interface MiniCalProps {
  focusedTime: number;
  setFocusedTime: (time: number) => void;
}

export const MiniCal: React.FC<MiniCalProps> = (props) => {
  const [activeDate, setActiveDate] = useState(new Date(props.focusedTime));
  const { followFocusedTime, setFollowFocusedTime } = useMiniCalContext();

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
      onActiveStartDateChange={({ activeStartDate }) => {
        if (activeStartDate == null) {
          throw new Error('no start date for requested view');
        }

        setFollowFocusedTime(false);
        setActiveDate(activeStartDate);
      }}
    />
  );
};
