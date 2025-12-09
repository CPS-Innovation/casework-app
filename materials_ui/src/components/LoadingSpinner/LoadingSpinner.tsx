type Props = { textContent?: string };

export const LoadingSpinner = ({ textContent }: Props) => {
  return (
    <div className="hods-loading-spinner">
      <div
        className="hods-loading-spinner__spinner"
        aria-live="polite"
        role="status"
      ></div>
      {textContent && (
        <div className="hods-loading-spinner__content">
          <div className="govuk-heading-m">{textContent}</div>
        </div>
      )}
    </div>
  );
};
