import { useEffect, useRef } from 'react';
import './GovUkTextarea.scss';

type TTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
type TProps = Omit<TTextareaProps, 'onInput'> & {
  onInput: (x: string) => void;
  initFocus: boolean;
};

export const GovUkTextarea = (p: TProps) => {
  const { className, onInput, initFocus, ...otherProps } = p;
  const textareaElmRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (textareaElmRef.current && initFocus) textareaElmRef.current.focus();
  }, []);

  return (
    <textarea
      ref={textareaElmRef}
      className={`govuk-textarea ${className}`}
      onInput={(e) => {
        const x = (e.target as unknown as { value: string }).value;
        onInput(x);
      }}
      {...otherProps}
    />
  );
};
