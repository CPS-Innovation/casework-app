type Props = { textContent?: string };

export const LoadingSpinner = ({ textContent = 'Loading...' }: Props) => {
  return (
    <div className="hods-loading-spinner" aria-live="polite" role="status">
      <div className="hods-loading-spinner__spinner"></div>
        <div className="hods-loading-spinner__content">
          <div className="govuk-heading-m">{textContent}</div>
        </div>
    </div>
  );
};
