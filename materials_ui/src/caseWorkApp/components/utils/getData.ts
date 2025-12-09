import { useMsal } from '@azure/msal-react';
import axios, { AxiosInstance } from 'axios';
import { getAccessTokenFromMsalInstance } from '../../../packages/DocumentSelectAccordion/getters/getAccessTokenFromMsalInstance';

export const useAxiosInstance = () => {
  const { instance: msalInstance } = useMsal();

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_POLARIS_GATEWAY_URL,
    withCredentials: true
  });

  axiosInstance.interceptors.request.use(async (config) => {
    const accessToken = await getAccessTokenFromMsalInstance(msalInstance);
    config.headers.Authorization = `Bearer ${accessToken}`;
    config.headers['Correlation-Id'] = crypto.randomUUID();

    return config;
  });

  return axiosInstance;
};

export const getDocuments = async (p: {
  axiosInstance: AxiosInstance;
  urn: string | undefined;
  caseId: number | undefined;
}) => {
  const response = await p.axiosInstance.get(
    `/api/urns/${p.urn}/cases/${p.caseId}/documents`
  );

  return response.data;
};

export const getPdfFiles = async (p: {
  axiosInstance: AxiosInstance;
  urn: string;
  caseId: number | string;
  documentId: number | string;
  versionId?: number | string;
}) => {
  const response = await p.axiosInstance.get(
    `/api/urns/${p.urn}/cases/${p.caseId}/documents/${p.documentId}/versions/${p.versionId}/pdf`,
    { responseType: 'blob' }
  );
  return response.data;
};

export const GetDataFromAxios = () => {
  return { useAxiosInstance, getDocuments, getPdfFiles };
};

