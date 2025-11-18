import useSWR from 'swr';

import { QUERY_KEYS } from '../constants/query';
import { useRequest } from './';

type UseCaseSearchProps = { urn?: string };

export const useCaseSearch = ({ urn }: UseCaseSearchProps) => {
  const request = useRequest();

  const getCase = async () =>
    await request
      .get<any>(`/api/urns/${urn}/cases`)
      .then((response) => response.data);

  const { data, isLoading, isValidating, mutate } = useSWR(
    urn ? [QUERY_KEYS.CASE_SEARCH, urn] : null,
    getCase
  );

  console.log('useCaseSearch data:', data);

  return {
    caseDetails: data || null,
    loading: isLoading || isValidating,
    refresh: mutate
  };
};
