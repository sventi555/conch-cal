interface NumberInputProps {
  label: string;
  val: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
}

export const NumberInput: React.FC<NumberInputProps> = (props) => {
  return (
    <div>
      <label>{props.label}:</label>
      <input
        type="number"
        value={props.val}
        onChange={(e) => props.onChange(parseInt(e.target.value))}
      />
    </div>
  );
};
