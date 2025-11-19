import useSWR from 'swr';

import { QUERY_KEYS } from '../constants/query';
import { CaseDetailsType } from '../schemas/caseDetails';
import { useRequest } from './';

export const useCaseSearch = (urn: string | undefined) => {
  const request = useRequest();

  const getCase = async () =>
    await request
      .get<CaseDetailsType>(`/api/urns/${urn}/cases`)
      .then((response) => response.data[0]);

  const { data, isLoading, isValidating, mutate } = useSWR(
    urn ? [QUERY_KEYS.CASE_SEARCH, urn] : null,
    getCase
  );

  return {
    caseDetails: data ?? null,
    loading: isLoading || isValidating,
    refresh: mutate
  };
};
