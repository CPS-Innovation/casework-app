import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCaseSearch } from '../hooks/useCaseSearch';

export const CaseSearchPage = () => {
  const [urn, setUrn] = useState('');
  const { caseDetails, loading } = useCaseSearch({ urn: urn });

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUrn('06SC1234571');
  };

  const leadDefendantFullName =
    caseDetails?.[0]?.leadDefendantDetails.surname +
    ', ' +
    caseDetails?.[0]?.leadDefendantDetails.firstNames;

  return (
    <div className="govuk-main-wrapper govuk-main-wrapper--auto-spacing">
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-half">
          <h1 className="govuk-heading-l govuk-!-margin-bottom-0">
            Find a case
          </h1>
          <p className="govuk-body govuk-hint govuk-!-margin-bottom-9">
            Search and review a CPS case in England and Wales
          </p>

          <div className="govuk-form-group">
            <h1 className="govuk-label-wrapper">
              <label className="govuk-label govuk-label--s" htmlFor="case-urn">
                Search for a case URN
              </label>
            </h1>
            <input
              id="case-urn"
              name="case-urn"
              type="text"
              className="govuk-input"
            />
          </div>

          <div className="govuk-button-group">
            <button
              className="govuk-button"
              data-module="govuk-button"
              type="submit"
              onClick={handleSearch}
            >
              Search
            </button>
            <a href="#" className="govuk-link">
              Cancel
            </a>
          </div>
        </div>
      </div>

      <div className="govuk-grid-row">
        <h1>Case search results</h1>
        <p className="govuk-body">
          We've found <b>1</b> case that matches <b>{urn}</b>
        </p>

        <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible"></hr>

        <div>
          <h2>
            <Link
              className="govuk-link"
              to={`/${urn}/${caseDetails[0].id}/materials`}
            >
              {urn}
            </Link>
          </h2>
          <p className="govuk-hint">{leadDefendantFullName}</p>
        </div>
      </div>
    </div>
  );
};
