import useSWR from 'swr';

import { AxiosInstance } from 'axios';
import { useBanner, useRequest } from '..';
import { QUERY_KEYS } from '../../constants/query';
import { CaseDetailsType } from '../../schemas/caseDetails';
import { useAxiosInstance } from '../ui/useRequest';

const MAX_URN_LENGTH = 11;

export const useCaseSearch = (urn: string | undefined) => {
  const truncatedUrn = urn?.slice(0, MAX_URN_LENGTH);
  const request = useRequest();
  const { resetBanner, setBanner } = useBanner();

  const getCase = async () => {
    resetBanner();

    return await request
      .get<CaseDetailsType>(`/urns/${truncatedUrn}/cases`)
      .then((response) => response.data);
  };

  const { data, isLoading, isValidating, mutate } = useSWR(
    urn ? [QUERY_KEYS.CASE_SEARCH, urn] : null,
    getCase,
    {
      onError: (error) => {
        if (error.status === 500) {
          setBanner({
            type: 'error',
            header: 'Something went wrong',
            content:
              'There was a problem with the server when searching for a case.'
          });
        }
      }
    }
  );

  return {
    caseDetails: data ?? null,
    loading: isLoading || isValidating,
    refresh: mutate
  };
};

export const getCaseDetails = async (p: {
  axiosInstance: AxiosInstance;
  urn: string;
}) => {
  return p.axiosInstance.get<CaseDetailsType>(`/urns/${p.urn}/cases`);
};

const getCaseDetailsKey = (p: { urn: string }) => `getCaseDetails-${p.urn}`;
export const useCaseDetails = (p: { urn: string }) => {
  const truncatedUrn = p.urn?.slice(0, MAX_URN_LENGTH);
  const axiosInstance = useAxiosInstance();
  const rtn = useSWR(
    getCaseDetailsKey({ urn: p.urn }), //
    () => {
      if (!p.urn) return;
      return getCaseDetails({ axiosInstance, urn: truncatedUrn });
    }
  );

  return rtn;
};
