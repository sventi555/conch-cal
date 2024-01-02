interface RadioDayProps {
  label: string;
  checked: boolean;
  onChecked: (day: string) => void;
  day: string;
  onChangeDay: (day: string) => void;
}

export const RadioDay: React.FC<RadioDayProps> = (props) => {
  return (
    <div>
      <label>{props.label}:</label>
      <input
        type="radio"
        checked={props.checked}
        onChange={(e) => {
          if (e.target.checked) props.onChecked(props.day);
        }}
      />
      <input
        type="date"
        disabled={!props.checked}
        min="1999-06-02"
        value={props.day}
        onChange={(e) => props.onChangeDay(e.target.value)}
      />
    </div>
  );
};
