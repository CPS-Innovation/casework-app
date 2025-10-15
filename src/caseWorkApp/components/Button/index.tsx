import React from "react";

type ButtonProps = {
  children?: React.ReactNode;
}

const Button:React.FC<ButtonProps> = ({children}: ButtonProps) => {
  return (
    <>
      <button
        type="submit"
        className="govuk-button govuk-button--secondary"
        data-module="govuk-button"
        data-govuk-button-init=""
      >
        {children}
        <span data-ismodified="1" className="br_wrap"></span>
      </button>
    </>
  );
};

export { Button };
