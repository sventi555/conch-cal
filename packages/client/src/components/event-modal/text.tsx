interface TextInputProps {
  autoFocus?: boolean;
  text: string;
  onChange: (text: string) => void;
}

export const TextInput: React.FC<TextInputProps> = (props) => {
  return (
    <div>
      <input
        autoFocus={props.autoFocus ?? false}
        placeholder="Add title"
        value={props.text}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};
