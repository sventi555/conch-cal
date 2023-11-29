import Calendar from 'react-calendar';
import './index.css';

interface MiniCalProps {
  setFocusedTime: (time: number) => void;
}

export const MiniCal: React.FC<MiniCalProps> = (props) => {
  return (
    <div>
      <div className="w-56">
        <Calendar
          formatShortWeekday={(locale, date) =>
            date.toLocaleDateString(undefined, { weekday: 'narrow' })
          }
          calendarType="gregory"
          onClickDay={(val) => {
            props.setFocusedTime(val.getTime());
          }}
        />
      </div>
    </div>
  );
};
