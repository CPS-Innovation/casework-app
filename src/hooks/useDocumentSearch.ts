import useSWR from 'swr';
import { SearchResultType } from '../schemas/documents';
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
    searchTerm && trackerComplete ? ['search', urn, caseId, searchTerm] : null,
    getSearch
  );

  return { searchResults: data ?? null, loading: isLoading };
};
