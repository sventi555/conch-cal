interface DateTimeProps {
  label: string;
  day: string;
  onChangeDay: (day: string) => void;
  time: string;
  onChangeTime: (time: string) => void;
}

export const DateTime: React.FC<DateTimeProps> = (props) => {
  return (
    <div>
      <label>{props.label}:</label>
      <input
        type="date"
        value={props.day}
        min="1999-06-02"
        onChange={(e) => props.onChangeDay(e.target.value)}
      />
      <input
        type="time"
        value={props.time}
        onChange={(e) => props.onChangeTime(e.target.value)}
      />
    </div>
  );
};
