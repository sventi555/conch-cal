import Calendar from 'react-calendar';
import './index.scss';

interface MiniCalProps {
  setFocusedTime: (time: number) => void;
}

export const MiniCal: React.FC<MiniCalProps> = (props) => {
  return (
    <Calendar
      formatShortWeekday={(locale, date) =>
        date.toLocaleDateString(undefined, { weekday: 'narrow' })
      }
      calendarType="gregory"
      onClickDay={(val) => {
        props.setFocusedTime(val.getTime());
      }}
    />
  );
};
