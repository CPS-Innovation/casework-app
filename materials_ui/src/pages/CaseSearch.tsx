import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Document, Page } from 'react-pdf';
import { Link } from 'react-router-dom';
import { getPdfFiles } from '../caseWorkApp/components/utils/getData';
import {
  DefinitionList,
  ErrorSummary,
  Layout,
  LoadingSpinner,
  SectionBreak,
  StatusTag
} from '../components';
import { useCaseInfoStore, useCaseSearch } from '../hooks';
import { useAxiosInstance } from '../materials_components/DocumentSelectAccordion/getters/getAxiosInstance';
import { useGetDocumentList } from '../materials_components/DocumentSelectAccordion/getters/getDocumentList';
import { useGetDocumentNotes } from '../materials_components/DocumentSelectAccordion/getters/getDocumentNotes';
import { formatDateLong } from '../utils/date';

type IFormInput = { urn: string };

// // Not Sensitive - with notes
const notSensitive = {
  urn: '54KR7689125',
  caseId: 2160797,
  documentId: 'CMS-8888949',
  versionId: '8142356'
};

// Sensitive
const sensitive = {
  urn: '45GD0000125',
  caseId: 2158184,
  documentId: 'CMS-8948775',
  versionId: '8164166'
};

const obj = { sensitive, notSensitive };
const key: keyof typeof obj = 'notSensitive';

const { urn, caseId, documentId, versionId } = obj[key];

const TestComp = () => {
  const [showDocList, setShowDocList] = useState(false);
  const [showDocNotes, setShowDocNotes] = useState(false);
  const [showDoc, setShowDoc] = useState(false);

  return (
    <div>
      <div>{key}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <button onClick={() => setShowDocList((prev) => !prev)}>
            Show doc list
          </button>
          <br />
          {showDocList && <GetDocListTestComp />}
        </div>
        <div>
          <button onClick={() => setShowDocNotes((prev) => !prev)}>
            Show doc notes
          </button>
          <br />
          {showDocNotes && <GetDocNotesTestComp />}
        </div>
        <div>
          <button onClick={() => setShowDoc((prev) => !prev)}>Show doc</button>
          <br />
          {showDoc && <GetDocTestComp />}
        </div>
      </div>
    </div>
  );
};

const GetDocListTestComp = () => {
  const docList = useGetDocumentList({ urn, caseId });

  useEffect(() => {
    docList.load();
  }, []);
  return (
    <div>
      blah
      <br />
      <pre>{JSON.stringify({ data: docList.data }, null, 2)}</pre>
    </div>
  );
};
const GetDocNotesTestComp = () => {
  const docList = useGetDocumentNotes({ urn, caseId, documentId });

  return (
    <div>
      blah
      <br />
      <pre>{JSON.stringify({ data: docList.data }, null, 2)}</pre>
    </div>
  );
};
const GetDocTestComp = () => {
  const axiosInstance = useAxiosInstance();
  const blobUrlRef = useRef<string>(undefined);
  const [status, setStatus] = useState<
    { mode: 'loading' | 'success' } | { mode: 'error'; message: string }
  >({ mode: 'loading' });

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const blob = await getPdfFiles({
          axiosInstance,
          urn,
          caseId,
          documentId,
          versionId
        });

        if (blob instanceof Blob) {
          const url = URL.createObjectURL(blob);
          blobUrlRef.current = url;
          setStatus({ mode: 'success' });
        } else {
          setStatus({ mode: 'error', message: 'An error occurred' });
        }
      } catch {
        setStatus({ mode: 'error', message: 'Not a blob' });
      }
    };

    loadPdf();

    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, []);

  return (
    <div>
      {status.mode}
      {status.mode === 'error' ? `: ${status.message}` : ''}
      <br />
      <pre>{JSON.stringify({ data: blobUrlRef.current }, null, 2)}</pre>

      {blobUrlRef.current && (
        <Document file={blobUrlRef.current}>
          <Page pageNumber={1} />
        </Document>
      )}
    </div>
  );
};

export const CaseSearchPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IFormInput>();
  const { clearCaseInfo } = useCaseInfoStore();
  const [queryUrn, setQueryUrn] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    const urn = data.urn?.trim() ?? '';
    setQueryUrn(urn);
    setHasSearched(true);
  };

  const { caseDetails, loading } = useCaseSearch(queryUrn || undefined);

  useEffect(() => {
    clearCaseInfo();
  }, []);

  const [show, setShow] = useState(false);

  return (
    <Layout plain title="Case Search">
      <div className="govuk-main-wrapper govuk-main-wrapper--auto-spacing">
        <div className="govuk-grid-row govuk-grid-row--case-search">
          <div className="govuk-grid-column-two-thirds">
            {errors.urn &&
              (errors.urn.type === 'required' ||
                (errors.urn.type === 'pattern' && (
                  <ErrorSummary
                    errorTitle={'There is a problem'}
                    errorMessage={errors.urn.message || ''}
                  />
                )))}

            <h1 className="govuk-heading-l govuk-!-margin-bottom-0">
              Find a case askjdh
            </h1>
            <br />
            <button onClick={() => setShow((x) => !x)}>button</button>

            {show && <TestComp />}

            <br />
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
          <div className="govuk-grid-row govuk-grid-row--case-search">
            <div className="govuk-grid-column-two-thirds">
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
