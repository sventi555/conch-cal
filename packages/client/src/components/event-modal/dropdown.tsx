interface DropdownProps<T extends string> {
  label: string;
  options: { label: string; val: T }[];
  selected: T;
  onChange: (val: T) => void;
}

export const Dropdown = <T extends string>(props: DropdownProps<T>) => {
  console.log(props.selected);
  return (
    <div>
      <label>{props.label}:</label>
      <select
        onChange={(e) => {
          props.onChange(e.target.value as T);
        }}
        value={props.selected}
      >
        {props.options.map((option) => (
          <option key={option.label} value={option.val}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
