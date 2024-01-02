interface RadioNumberProps {
  label: string;
  checked: boolean;
  onChecked: (num: number) => void;
  num: number;
  onChangeNum: (num: number) => void;
  min?: number;
}

export const RadioNumber: React.FC<RadioNumberProps> = (props) => {
  return (
    <div>
      <label>{props.label}:</label>
      <input
        type="radio"
        checked={props.checked}
        onChange={(e) => {
          if (e.target.checked) props.onChecked(props.num);
        }}
      />
      <input
        type="number"
        disabled={!props.checked}
        value={props.num}
        min={props.min}
        onChange={(e) => props.onChangeNum(parseInt(e.target.value))}
      />
    </div>
  );
};
