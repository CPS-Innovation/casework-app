import { ReactNode, useState } from 'react';
import './DefaultAccordion.scss';

export const DefaultAccordionSection = (p: {
  title: string;
  children: ReactNode;
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div>
      <div className="govuk-accordion__section">
        <div className="govuk-accordion__section-header">
          <h2 className="govuk-accordion__section-heading">
            <div>
              <button
                type="button"
                aria-controls={`accordion-default-content`}
                className="govuk-accordion__section-button"
                aria-expanded={isExpanded}
                aria-label={p.title}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <span className="govuk-accordion__section-toggle">
                  <span className="govuk-accordion__section-toggle-focus">
                    <span className="govuk-accordion__section-toggle-text">
                      {p.title}
                    </span>
                    <span className="govuk-accordion-nav__chevron-wrapper">
                      <span
                        className={`govuk-accordion-nav__chevron${!isExpanded ? ' govuk-accordion-nav__chevron--down' : ''}`}
                      />
                    </span>
                  </span>
                </span>
              </button>
            </div>
          </h2>
        </div>
      </div>
      <div hidden={!isExpanded}>{p.children}</div>
    </div>
  );
};

export const CwaDefaultAccordionDocument = () => {
  return (
    <div
      style={{
        display: 'flex',
        padding: '12px 22px',
        border: 'solid 1px #b1b4b6',
        borderLeft: 'solid 5px #1d70b8',
        backgroundColor: '#1d70b813'
      }}
    >
      <div
        style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div>
          <strong className="govuk-tag">Completed</strong>
        </div>
        <div className="govuk-link" onClick={() => {}}>
          stmt BLAYNEE 2034 1 JUNE mg11
        </div>
        <div>Date: 13/01/2025</div>
      </div>
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'end' }}
      >
        <span>
          <NotesIcon width={20} />
        </span>
      </div>
    </div>
  );
};

const NotesIcon = (p: { width: number }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 511.072 511.072"
      style={{ width: p.width + 'px' }}
    >
      <g>
        <g>
          <path d="m74.39 480.536h-36.213l25.607-25.607c13.807-13.807 22.429-31.765 24.747-51.246-36.029-23.644-62.375-54.751-76.478-90.425-14.093-35.647-15.864-74.888-5.121-113.482 12.89-46.309 43.123-88.518 85.128-118.853 45.646-32.963 102.47-50.387 164.33-50.387 77.927 0 143.611 22.389 189.948 64.745 41.744 38.159 64.734 89.63 64.734 144.933 0 26.868-5.471 53.011-16.26 77.703-11.165 25.551-27.514 48.302-48.593 67.619-46.399 42.523-112.042 65-189.83 65-28.877 0-59.01-3.855-85.913-10.929-25.465 26.123-59.972 40.929-96.086 40.929zm182-420c-124.039 0-200.15 73.973-220.557 147.285-19.284 69.28 9.143 134.743 76.043 175.115l7.475 4.511-.23 8.727c-.456 17.274-4.574 33.912-11.945 48.952 17.949-6.073 34.236-17.083 46.99-32.151l6.342-7.493 9.405 2.813c26.393 7.894 57.104 12.241 86.477 12.241 154.372 0 224.682-93.473 224.682-180.322 0-46.776-19.524-90.384-54.976-122.79-40.713-37.216-99.397-56.888-169.706-56.888z" />
        </g>
      </g>
    </svg>
  );
};

export const DefaultAccordion = (p: {
  children: ReactNode;
  plain?: boolean;
}) => {
  const { plain = true } = p;
  return (
    <div
      className={`govuk-accordion${plain ? ' govuk-accordion--plain' : ''}`}
      data-testid="accordion"
    >
      {p.children}
    </div>
  );
};
