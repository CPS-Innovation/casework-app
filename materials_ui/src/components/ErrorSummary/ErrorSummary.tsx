export type ErrorSummaryItem = { id: string; message: string };

type Props = { errorTitle: string; errorMessage: string | ErrorSummaryItem[] };

export const ErrorSummary = ({ errorTitle, errorMessage }: Props) => {
  const handleLinkClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView();
      el.focus();
    }
  };

  if (!errorMessage || !errorMessage.length) {
    return null;
  }

  return (
    <div className="govuk-error-summary" data-module="govuk-error-summary">
      <div role="alert">
        <h2 className="govuk-error-summary__title">{errorTitle}</h2>
        <div className="govuk-error-summary__body">
          <ul className="govuk-list govuk-error-summary__list">
            {typeof errorMessage === 'string' ? (
              <li>{errorMessage}</li>
            ) : (
              errorMessage.map(({ id, message }) => (
                <li key={id}>
                  <a
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      handleLinkClick(id);
                    }}
                  >
                    {message}
                  </a>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
