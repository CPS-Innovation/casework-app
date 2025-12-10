import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import {
  DefinitionList,
  ErrorSummary,
  Layout,
  LoadingSpinner,
  SectionBreak,
  StatusTag
} from '../components';
import { useCaseSearch } from '../hooks';
import { formatDateLong } from '../utils/date';

type IFormInput = { urn: string };

export const CaseSearchPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IFormInput>();
  const [queryUrn, setQueryUrn] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    const urn = data.urn?.trim() ?? '';
    setQueryUrn(urn);
    setHasSearched(true);
  };

  const { caseDetails, loading } = useCaseSearch(queryUrn || undefined);

  return (
    <Layout plain title="Case Search">
      <div className="govuk-main-wrapper govuk-main-wrapper--auto-spacing">
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-half">
            {errors.urn &&
              (errors.urn.type === 'required' ||
                (errors.urn.type === 'pattern' && (
                  <ErrorSummary
                    errorTitle={'There is a problem'}
                    errorMessage={errors.urn.message || ''}
                  />
                )))}

            <h1 className="govuk-heading-l govuk-!-margin-bottom-0">
              Find a case
            </h1>
            <p className="govuk-body govuk-hint govuk-!-margin-bottom-9">
              Search and review a CPS case in England and Wales
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div
                className={`govuk-form-group${errors.urn ? ' govuk-form-group--error' : ''}`}
              >
                <h1 className="govuk-label-wrapper">
                  <label
                    className="govuk-label govuk-label--s"
                    htmlFor="case-urn"
                  >
                    Search for a case URN
                  </label>
                </h1>

                {errors.urn && (
                  <p id="case-urn-error" className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span>{' '}
                    {errors.urn.message}
                  </p>
                )}

                <input
                  className={`govuk-input ${errors.urn ? 'govuk-input--error' : ''}`}
                  id="case-urn"
                  type="text"
                  {...register('urn', { required: 'URN is required' })}
                />
              </div>

              <div className="govuk-button-group">
                <button
                  className="govuk-button"
                  data-module="govuk-button"
                  type="submit"
                >
                  Search
                </button>
                <a href="#" className="govuk-link">
                  Cancel
                </a>
              </div>
            </form>
          </div>
        </div>

        {loading && <LoadingSpinner textContent="Searching for a case..." />}

        {!loading && hasSearched && !caseDetails && (
          <p className="govuk-body">
            We've found <b>0</b> case that matches <b>{queryUrn}</b>
          </p>
        )}

        {!loading && Array.isArray(caseDetails) && caseDetails && (
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-one-half">
              <p className="govuk-body">
                We've found <b>{caseDetails.length}</b> case that matches{' '}
                <b>{queryUrn}</b>
              </p>

              {caseDetails.map((caseItem) => {
                const lead = caseItem.leadDefendantDetails;

                const defendantFullName = lead
                  ? `${lead.surname}, ${lead.firstNames}${
                      (caseItem.defendants?.length ?? 0) > 1
                        ? ' and others'
                        : ''
                    }`
                  : '';

                const dateOfBirth = lead
                  ? `Date of birth: ${formatDateLong(lead.dob)}`
                  : '';

                const nextHearingDate = formatDateLong(
                  caseItem.headlineCharge?.nextHearingDate
                );

                const dateOfOffence = formatDateLong(
                  caseItem.headlineCharge?.date
                );

                return (
                  <div key={caseItem.id}>
                    <SectionBreak />
                    <div>
                      <h2>
                        <Link
                          className="govuk-link govuk-!-margin-bottom-0"
                          to={`/${queryUrn}/${caseItem.id}/materials`}
                        >
                          {caseItem.uniqueReferenceNumber}
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
                      {caseItem.isCaseCharged ? (
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
                                  `${caseItem.defendants[0].charges[0].shortDescription}`
                                ]
                              }
                            ]}
                          />
                        </>
                      ) : (
                        <DefinitionList
                          fixedWidth
                          items={[
                            {
                              title: 'Status: ',
                              description: [
                                <StatusTag status="Not yet charged" />
                              ]
                            },
                            {
                              title: 'Proposed: ',
                              description: [
                                !caseItem.defendants[0].proposedCharges
                                  .length && 'N/A'
                              ]
                            }
                          ]}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
