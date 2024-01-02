import { Fragment } from 'react';

interface CheckboxGroupProps<T extends string> {
  label: string;
  options: { label: string; val: T }[];
  checkedVals: Set<T>;
  onChange: (val: T, checked: boolean) => void;
}

export const CheckboxGroup = <T extends string>(
  props: CheckboxGroupProps<T>,
) => {
  return (
    <div>
      <label>{props.label}:</label>
      {props.options.map((option) => (
        <Fragment key={option.label}>
          <label>{option.label}</label>
          <input
            type="checkbox"
            onChange={(e) => props.onChange(option.val, e.target.checked)}
          />
        </Fragment>
      ))}
    </div>
  );
};
