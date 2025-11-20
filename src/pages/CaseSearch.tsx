import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DefinitionList, LoadingSpinner, StatusTag } from '../components';
import { useCaseSearch } from '../hooks/useCaseSearch';
import { formatDateLong } from '../utils/date';

export const CaseSearchPage = () => {
  const [inputUrn, setInputUrn] = useState('');
  const [queryUrn, setQueryUrn] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const { caseDetails, loading } = useCaseSearch(queryUrn);

  if (loading) {
    return <LoadingSpinner textContent="Searching for a case..." />;
  }

  if (hasSearched && !caseDetails && !loading) return <p>No case found.</p>;

  const handleSearch = (
    event: React.FormEvent<HTMLFormElement> | React.MouseEvent
  ) => {
    event.preventDefault?.();
    setQueryUrn(inputUrn || '');
    setHasSearched(true);
  };

  const lead = caseDetails?.leadDefendantDetails;

  const defendantFullName = lead
    ? `${lead.surname}, ${lead.firstNames}` +
      ((caseDetails?.defendants?.length ?? 0) > 1 ? ' and others' : '')
    : '';

  const dateOfBirth = caseDetails
    ? `Date of birth: ${formatDateLong(caseDetails.leadDefendantDetails?.dob)}`
    : '';

  const nextHearingDate = formatDateLong(
    caseDetails?.headlineCharge?.nextHearingDate
  );

  const dateOfOffence = formatDateLong(caseDetails?.headlineCharge?.date);

  return (
    <div className="govuk-main-wrapper govuk-main-wrapper--auto-spacing">
      <div className="govuk-grid-row">
        <div>
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
              value={inputUrn}
              onChange={(e) => setInputUrn(e.target.value)}
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

      {caseDetails && !loading && (
        <div className="govuk-grid-row">
          <p className="govuk-body">
            We've found <b>{caseDetails.defendants.length}</b> case that matches{' '}
            <b>{queryUrn}</b>
          </p>

          <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible"></hr>

          <div>
            <h2>
              <Link
                className="govuk-link govuk-!-margin-bottom-0"
                to={`/${queryUrn}/${caseDetails.id}/materials`}
              >
                {queryUrn}
              </Link>
            </h2>
            {caseDetails && (
              <>
                <p className="govuk-hint govuk-!-margin-top-0 govuk-!-margin-bottom-0">
                  {defendantFullName}
                </p>
                <p className="govuk-hint govuk-!-margin-top-0 govuk-!-margin-bottom-0">
                  {dateOfBirth}
                </p>
              </>
            )}
          </div>

          <div className="govuk-!-margin-top-4">
            {caseDetails.isCaseCharged ? (
              <>
                <DefinitionList
                  fixedWidth
                  items={[
                    {
                      title: 'Status: ',
                      description: [<StatusTag status="Charged" />]
                    },
                    {
                      title: 'Court hearing: ',
                      description: [`${nextHearingDate}`]
                    },
                    {
                      title: 'Date of offence: ',
                      description: [`${dateOfOffence}`]
                    },
                    {
                      title: 'Charges: ',
                      description: [
                        `${caseDetails.defendants[0].charges[0].shortDescription}`
                      ]
                    }
                  ]}
                />
              </>
            ) : (
              <p className="govuk-body">
                Status: <StatusTag status="Not yet charged" />
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
