import { useState } from 'react';
import { useDocumentSearch } from '../../hooks';
import { useDocuments } from '../../hooks/useDocuments';
import { useDocumentSearchResults } from '../../hooks/useDocumentSearchResults';
import { useSearchTracker } from '../../hooks/useSearchTracker';
import { formatDateLong } from '../../utils/date';
import { Modal } from '../Modal/Modal';
import { SearchInput } from '../SearchInput/SearchInput';
import { SectionBreak } from '../SectionBreak/SectionBreak';
import { TwoCol } from '../TwoCol/TwoCol';

export const SearchTest = () => {
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedDocuments, setExpandedDocuments] = useState<
    Record<string, boolean>
  >({});

  const { isComplete: trackerComplete, trackerData } =
    useSearchTracker(searchTerm);

  const { searchResults, loading } = useDocumentSearch(
    searchTerm,
    trackerComplete
  );

  const { documents } = useDocuments();

  const combinedSearchResults = useDocumentSearchResults(
    documents ?? [],
    searchResults ?? []
  );

  const toggleDocumentExpand = (docId: string) => {
    setExpandedDocuments((prev) => ({ ...prev, [docId]: !prev[docId] }));
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleSearchSubmit = () => {
    setSearchTerm(inputValue);
    setModalOpen(true);
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Document Search Test</h3>

      <SearchInput
        id="search-within-case"
        label="Search within a case"
        onChange={handleInputChange}
        onSearch={handleSearchSubmit}
        placeholder="Enter search term"
      />

      <Modal
        open={modalOpen}
        title="Search Results"
        onClose={() => setModalOpen(false)}
      >
        <TwoCol
          sidebar={
            <>
              <h1>Sidebar</h1>
            </>
          }
        >
          {!trackerComplete && (
            <p>
              Preparing search pipeline… <br />
              {trackerData?.status ?? 'Starting…'}
            </p>
          )}

          {trackerComplete && loading && <p>Searching…</p>}

          {!loading &&
            trackerComplete &&
            combinedSearchResults &&
            combinedSearchResults.map((doc) => {
              const isExpanded = expandedDocuments[doc.documentId] ?? false;
              const first = doc.matches[0];
              const remainingCount = doc.matches.length - 1;

              return (
                <div key={doc.documentId} style={{ marginBottom: 20 }}>
                  <p className="govuk-body">
                    <strong>{combinedSearchResults.length}</strong> results in{' '}
                    <strong>{documents?.length}</strong> documents in this case
                  </p>

                  <h2 className="govuk-heading-m">
                    <a>{doc.documentTitle}</a>
                  </h2>

                  <p className="govuk-body">
                    Uploaded: {formatDateLong(doc.cmsFileCreatedDate)}
                  </p>

                  <div className="govuk-inset-text">
                    {/* First match */}
                    <p>
                      <strong>{first.text}</strong>
                    </p>

                    {/* Remaining matches (expanded) */}
                    {isExpanded && remainingCount > 0 && (
                      <>
                        {doc.matches.slice(1).map((match, index) => (
                          <div key={index} style={{ marginTop: '1rem' }}>
                            <strong>{match.text}</strong>
                          </div>
                        ))}
                      </>
                    )}

                    {/* Toggle link */}
                    {remainingCount > 0 && (
                      <span
                        style={{
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          display: 'inline-block',
                          marginTop: 8
                        }}
                        onClick={() => toggleDocumentExpand(doc.documentId)}
                      >
                        {isExpanded
                          ? 'Hide additional results'
                          : `View ${remainingCount} more`}
                      </span>
                    )}
                  </div>

                  <SectionBreak />
                </div>
              );
            })}

          {/* No results */}
          {!loading &&
            trackerComplete &&
            combinedSearchResults?.length === 0 &&
            searchTerm && <p>No results.</p>}
        </TwoCol>
      </Modal>
    </div>
  );
};
