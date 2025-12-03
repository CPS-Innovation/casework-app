import useSWR from 'swr';

import { QUERY_KEYS } from '../constants/query';
import { CaseInfoResponseType } from '../schemas/caseinfo';
import { useRequest } from './';

type UseCaseInfoProps = { caseId?: number | string; urn?: string };

export const useCaseInfo = ({ caseId, urn }: UseCaseInfoProps) => {
  const request = useRequest();

  const getCaseInfo = async () =>
    await request
      .get<CaseInfoResponseType>(`/urns/${urn}/case-info/${caseId}`)
      .then((response) => response.data);

  const { data, isLoading, isValidating, mutate } = useSWR(
    caseId && urn ? QUERY_KEYS.CASE_INFO : null,
    getCaseInfo
  );

  return {
    caseInfo: data || null,
    loading: isLoading || isValidating,
    refresh: mutate
  };
};
