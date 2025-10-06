import useSWR from 'swr';
import { QUERY_KEYS } from '../constants/query';
import { API_ENDPOINTS } from '../constants/url';
import { useRequest } from '../hooks';
import { PCDListingResponseType, PCDListingType } from '../schemas/pcd';
import { replaceTokens } from '../utils/string';

export const usePCDList = (caseId?: number) => {
  const request = useRequest();
  console.log({ caseId });
  const getPCDList = async () =>
    await request
      .get<PCDListingResponseType>(
        replaceTokens(API_ENDPOINTS.PCD_REQUEST_LIST, { caseId: caseId || '' })
      )
      .then((response) => response.data);

  const { data, error, isLoading } = useSWR(
    caseId ? QUERY_KEYS.PCD_REQUESTS : null,
    getPCDList
  );

  const sortByDate = (a: PCDListingType, b: PCDListingType) =>
    Date.parse(b.decisionRequested) - Date.parse(a.decisionRequested);

  return { data: data?.sort(sortByDate) || undefined, error, isLoading };
};
