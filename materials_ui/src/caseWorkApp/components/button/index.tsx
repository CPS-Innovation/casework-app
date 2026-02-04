import React from 'react';
import classes from './Button.module.scss';

type TButtonVariant = 'primary' | 'secondary' | 'inverse' | 'default';

type ButtonProps = {
  onClick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
  variant?: TButtonVariant;
};

const buttonVariantMap: { [k in TButtonVariant]: string } = {
  primary: '',
  inverse: 'govuk-button--inverse',
  default: 'govuk-button--secondary',
  secondary: 'govuk-button--secondary'
};

const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  children,
  variant = 'default'
}) => {
  const variantClass = buttonVariantMap[variant];

  return (
    <button
      type="submit"
      className={`govuk-button ${variantClass} ${classes.cwaSubmitButton}`}
      data-module="govuk-button"
      data-govuk-button-init=""
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      <span data-ismodified="1" className="br_wrap"></span>
    </button>
  );
};

export { Button };
