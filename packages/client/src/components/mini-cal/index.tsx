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
          onClickDay={(val) => {
            props.setFocusedTime(val.getTime());
          }}
        />
      </div>
    </div>
  );
};
