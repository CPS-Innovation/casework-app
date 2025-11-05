type TTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
type TProps = Omit<TTextareaProps, 'onInput'> & {
  onInput: (x: string) => void;
};

export const Textarea = (p: TProps) => {
  const { style, className, onInput, ...otherProps } = p;

  return (
    <textarea
      className={`govuk-textarea ${className}`}
      onInput={(e) => {
        const x = (e.target as unknown as { value: string }).value;
        onInput(x);
      }}
      style={{ marginBottom: 0, ...style }}
      {...otherProps}
    />
  );
};
