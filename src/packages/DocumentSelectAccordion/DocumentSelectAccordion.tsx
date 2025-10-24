import { ReactNode, useState } from 'react';
import './DocumentSelectAccordion.scss';

export const DocumentSelectAccordionSection = (p: {
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
                aria-controls="accordion-default-content"
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
      <div hidden={!isExpanded}>
        <div className="govuk-accordion-content-wrapper">{p.children}</div>
      </div>
    </div>
  );
};

export const DocumentSelectAccordion = (p: { children: ReactNode }) => {
  return (
    <div className="govuk-accordion" data-testid="accordion">
      {p.children}
    </div>
  );
};
