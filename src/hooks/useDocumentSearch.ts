import useSWR from 'swr';
import { QUERY_KEYS } from '../constants/query';
import {
  DocumentResultType,
  SearchResultType,
  SearchTermResultType
} from '../schemas/documents';
import { useCaseInfoStore, useRequest } from './';

export const useDocumentSearch = (
  searchTerm: string | null,
  trackerComplete: boolean
) => {
  const request = useRequest();
  const { caseInfo } = useCaseInfoStore();

  const urn = caseInfo?.urn;
  const caseId = caseInfo?.id.toString();

  const getSearch = () =>
    request
      .get<
        SearchResultType[]
      >(`/urns/${urn}/cases/${caseId}/search/?query=${searchTerm}`)
      .then((res) => res.data);

  const { data, isLoading } = useSWR(
    searchTerm && trackerComplete
      ? [QUERY_KEYS.DOCUMENT_SEARCH, urn, caseId, searchTerm]
      : null,
    getSearch
  );

  return { searchResults: data ?? null, loading: isLoading };
};

export const useDocumentSearchResults = (
  documents: DocumentResultType = [],
  searchResults: SearchResultType[] = []
) => {
  if (!documents || !searchResults) return [];

  const combinedSearchResults: SearchTermResultType[] = [];

  for (const doc of documents) {
    const matches = searchResults.filter(
      (sr) => sr.documentId === doc.documentId
    );

    if (matches.length > 0) {
      combinedSearchResults.push({
        documentId: doc.documentId,
        documentTitle: doc.presentationTitle ?? '',
        cmsFileCreatedDate: doc.cmsFileCreatedDate,
        matches: matches.map((match) => ({
          text: match.text,
          pageIndex: match.pageIndex,
          lineIndex: match.lineIndex,
          words: match.words
        }))
      });
    }
  }

  return combinedSearchResults;
};
