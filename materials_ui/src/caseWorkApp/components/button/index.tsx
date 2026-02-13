import React from 'react';

type TButtonVariant = 'primary' | 'secondary' | 'inverse' | 'default';
type TButtonSize = 's' | 'm';

type ButtonProps = {
  onClick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
  variant?: TButtonVariant;
  type?: 'submit' | 'reset' | 'button' | undefined;
  size?: TButtonSize;
  dataTestId?: string;
  id?: string;
  ariaLabel?: string;
};

const buttonVariantMap: { [k in TButtonVariant]: string } = {
  primary: '',
  inverse: 'govuk-button--inverse',
  default: 'govuk-button--secondary',
  secondary: 'govuk-button--secondary'
};

const buttonSizeStyleMap: { [k in TButtonSize]: Record<string, string> } = {
  s: { fontSize: '0.875rem' },
  m: {}
};

export const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  children,
  variant = 'default',
  type,
  size = 'm',
  dataTestId,
  ariaLabel,
  id
}) => {
  const variantClass = buttonVariantMap[variant];
  const sizeStyle = buttonSizeStyleMap[size];

  return (
    <button
      type={type}
      className={`govuk-button ${variantClass}`}
      data-module="govuk-button"
      data-govuk-button-init=""
      onClick={onClick}
      disabled={disabled}
      style={sizeStyle}
      data-test-id={dataTestId}
      id={id}
      aria-label={ariaLabel}
    >
      {children}
      <span data-ismodified="1" className="br_wrap"></span>
    </button>
  );
};
