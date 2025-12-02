import { useMemo, useState } from 'react';
import {
  useDocuments,
  useDocumentSearch,
  useDocumentSearchResults,
  useFilters,
  useSearchTracker
} from '../../hooks';

import { LoadingSpinner, Modal, SearchInput, SectionBreak, TwoCol } from '../';

import { categoriseDocument } from '../../packages/DocumentSelectAccordion/utils/categoriseDocument';
import { SearchTermResultType } from '../../schemas/documents';
import { formatDateLong } from '../../utils/date';
import { defaultSearchFn } from '../../utils/filtering';
import { DocumentKeywordSearchFilters } from '../Filters/DocumentKeywordSearchFilters';

import './DocumentKeywordSearch.scss';

export const DocumentKeywordSearch = () => {
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

  const { filters } = useFilters('documents');

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

  const filteredResults = useMemo(() => {
    const selectedCategories = filters?.filters?.category ?? [];
    const searchFn = defaultSearchFn<SearchTermResultType>(
      'documentTitle',
      filters?.search
    );

    return combinedSearchResults
      .filter((doc) => {
        const category = categoriseDocument(doc);

        return (
          selectedCategories.length === 0 ||
          selectedCategories.includes(category)
        );
      })
      .filter(searchFn);
  }, [combinedSearchResults, filters?.filters?.category, filters?.search]);

  return (
    <div style={{ marginBottom: '20px' }}>
      <SearchInput
        id="search-within-case"
        label="Search within a case"
        onChange={handleInputChange}
        onSearch={handleSearchSubmit}
        placeholder="Enter search term"
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {!trackerComplete ? (
          <LoadingSpinner textContent="Loading search results" />
        ) : (
          <TwoCol sidebar={<DocumentKeywordSearchFilters />}>
            {!trackerComplete && (
              <p>
                Preparing search pipeline… <br />
                {trackerData?.status ?? 'Starting…'}
              </p>
            )}

            {trackerComplete && loading && <p>Searching…</p>}

            {!loading && trackerComplete && filteredResults && (
              <div className="search-results-message">
                <div>
                  <p className="govuk-body govuk-!-margin-bottom-0">
                    <strong>{filteredResults.length}</strong> results in{' '}
                    <strong>{documents?.length}</strong> documents in this case
                  </p>
                  <p className="govuk-body">
                    Search may not have found all instances of "{searchTerm}" in
                    this case.
                  </p>
                </div>

                <div className="govuk-form-group">
                  <label
                    className="govuk-label govuk-visually-hidden"
                    htmlFor="sort"
                  >
                    Sort by
                  </label>
                  <select className="govuk-select" id="sort" name="sort">
                    <option value="date" defaultValue="date" selected>
                      Date added
                    </option>
                    <option value="comments">Results per document</option>
                  </select>
                </div>
              </div>
            )}

            {!loading &&
              trackerComplete &&
              filteredResults &&
              filteredResults.map((doc) => {
                const isExpanded = expandedDocuments[doc.documentId] ?? false;
                const first = doc.matches[0];
                const remainingCount = doc.matches.length - 1;

                return (
                  <div key={doc.documentId} style={{ marginBottom: 20 }}>
                    <h2 className="govuk-heading-m govuk-!-margin-bottom-1">
                      <a
                        href={`/materials?material=${doc.documentId}`}
                        rel="noreferrer"
                      >
                        {doc.documentTitle}
                      </a>
                    </h2>

                    <p className="govuk-body-s">
                      Uploaded: {formatDateLong(doc.cmsFileCreatedDate)} Type{' '}
                      {doc.cmsDocType.documentType}
                    </p>

                    <div className="govuk-inset-text">
                      <p>
                        <strong>{first.text}</strong>
                      </p>

                      {isExpanded && remainingCount > 0 && (
                        <>
                          {doc.matches.slice(1).map((match, index) => (
                            <div key={index} style={{ marginTop: '1rem' }}>
                              <strong>{match.text}</strong>
                            </div>
                          ))}
                        </>
                      )}

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

            {!loading &&
              trackerComplete &&
              filteredResults?.length === 0 &&
              searchTerm && <p>No results.</p>}
          </TwoCol>
        )}
      </Modal>
    </div>
  );
};
