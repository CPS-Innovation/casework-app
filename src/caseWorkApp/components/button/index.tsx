import React from 'react';
import { z } from 'zod';
import './Button.module.scss';

type ButtonProps = {
  onClick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
};

// const ButtonPropsSchema = z.object({
//   onClick: z.function().args().returns(z.void()).optional(),
//   childen: z.any().optional(),
//   disabled: z.boolean().optional
// });

// type ButtonProps = z.infer<typeof ButtonPropsSchema>;

export const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled,
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
      >
        {children}
        <span data-ismodified="1" className="br_wrap"></span>
      </button>
    </>
  );
};

