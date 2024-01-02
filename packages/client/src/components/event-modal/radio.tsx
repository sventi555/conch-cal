interface RadioProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Radio: React.FC<RadioProps> = (props) => {
  return (
    <div>
      <label>{props.label}:</label>
      <input
        type="radio"
        checked={props.checked}
        onChange={(e) => {
          props.onChange(e.target.checked);
        }}
      />
    </div>
  );
};
