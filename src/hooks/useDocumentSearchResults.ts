import {
  DocumentResultType,
  SearchResultType,
  SearchTermResultType
} from '../schemas/documents';

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
