import { AxiosInstance } from 'axios';
import useSWR from 'swr';
import { useAxiosInstance } from './useAxiosInstance';

export const getCaseFromAxiosInstance = async (p: {
  axiosInstance: AxiosInstance;
  urn: string | undefined;
  caseId: number | undefined;
}) => {
  const response = await p.axiosInstance.get(
    `/api/urns/${p.urn}/cases/${p.caseId}?name=getCase`
  );

  return response.data;
};

export const useGetCase = (p: {
  urn: string | undefined;
  caseId: number | undefined;
}) => {
  const axiosInstance = useAxiosInstance();

  const { data, error, isLoading } = useSWR('getCase', () => {
    return getCaseFromAxiosInstance({ axiosInstance, ...p });
  });

  return { data, error, isLoading };
};
