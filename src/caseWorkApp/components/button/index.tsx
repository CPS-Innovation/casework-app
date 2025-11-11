import React from 'react';
import './Button.module.scss';

type ButtonProps = {
  onClick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  children
}) => {
  return (
    <>
      <button
        type="submit"
        className="govuk-button govuk-button--secondary"
        data-module="govuk-button"
        data-govuk-button-init=""
        onClick={onClick}
        disabled={disabled}
      >
        {children}
        <span data-ismodified="1" className="br_wrap"></span>
      </button>
    </>
  );
};

export { Button };

