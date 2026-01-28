import { useMsal } from '@azure/msal-react';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { getAccessTokenFromMsalInstance } from '../../../materials_components/DocumentSelectAccordion/getters/getAccessTokenFromMsalInstance';

export const useAxiosInstance = () => {
  const { instance: msalInstance } = useMsal();

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_POLARIS_GATEWAY_URL,
    withCredentials: true
  });

  console.log('we are not yet here');
  axiosInstance.interceptors.request.use(async (config) => {
    console.log('we are here');
    const accessToken = await getAccessTokenFromMsalInstance(msalInstance);
    const Authorization = `Bearer ${accessToken}`;
    const CorrelationId = crypto.randomUUID();

    console.log({ Authorization, CorrelationId });

    config.headers.Authorization = Authorization;
    config.headers['Correlation-Id'] = CorrelationId;

    return config;
  });

  return axiosInstance;
};

export const getDocuments = async (p: {
  axiosInstance: AxiosInstance;
  urn: string | undefined;
  caseId: number | undefined;
}) => {
  try {
    const response = await p.axiosInstance.get(
      `/api/urns/${p.urn}/cases/${p.caseId}/documents`
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError)
      console.error(`Error getting documents: ${error.message}`);
  }
};

export const getPdfFiles = async (p: {
  axiosInstance: AxiosInstance;
  urn: string;
  caseId: number | string;
  documentId: number | string;
  versionId?: number | string;
}) => {
  try {
    const response = await p.axiosInstance.get(
      `/api/urns/${p.urn}/cases/${p.caseId}/documents/${p.documentId}/versions/${p.versionId}/pdf`,
      { responseType: 'blob' }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError)
      console.error(`Error getting PDF file: ${error.message}`);
  }
};

export const GetDataFromAxios = () => {
  return { useAxiosInstance, getDocuments, getPdfFiles };
};
