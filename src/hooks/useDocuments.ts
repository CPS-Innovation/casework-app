import useSWR from 'swr';
import { QUERY_KEYS } from '../constants/query';
import { DocumentResultType } from '../schemas/documents';
import { useCaseInfoStore, useRequest } from './';

export const useDocuments = () => {
  const request = useRequest();
  const { caseInfo } = useCaseInfoStore();

  const urn = caseInfo?.urn;
  const caseId = caseInfo?.id.toString();

  const getDocuments = () =>
    request
      .get<DocumentResultType>(`/urns/${urn}/cases/${caseId}/documents`)
      .then((res) => res.data);

  const { data, isLoading } = useSWR(
    urn && caseId ? [QUERY_KEYS.GET_ALL_DOCUMENTS, urn, caseId] : null,
    getDocuments
  );

  return { documents: data ?? null, loading: isLoading };
};
