import { useMsal } from '@azure/msal-react';
import axios from 'axios';
import { POLARIS_GATEWAY_URL } from '../constants/url';
import { loginRequest } from '../msalInstance';

export const useRequest = () => {
  const { instance: msalInstance } = useMsal();

  const axiosInstance = axios.create({
    baseURL: POLARIS_GATEWAY_URL,
    withCredentials: true
  });

  axiosInstance.interceptors.request.use(async (config) => {
    const tokenResponse = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account: msalInstance.getActiveAccount()!
    });

    config.headers['Authorization'] = `Bearer ${tokenResponse.accessToken}`;
    config.headers['Correlation-Id'] = crypto.randomUUID();

    return config;
  });

  return axiosInstance;
};
