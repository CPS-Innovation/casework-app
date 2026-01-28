import { useMsal } from '@azure/msal-react';
import axios from 'axios';
import { getAccessTokenFromMsalInstance } from './getAccessTokenFromMsalInstance';

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

  // axiosInstance.interceptors.request.use(async (config) => {
  //   const accessToken = await getAccessTokenFromMsalInstance(msalInstance);
  //   config.headers.Authorization = `Bearer ${accessToken}`;
  //   config.headers["Correlation-Id"] = crypto.randomUUID();

  //   return config;
  // });

  return axiosInstance;
};
