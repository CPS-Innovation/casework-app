import axios from 'axios';
import { POLARIS_GATEWAY_URL } from '../constants/url';

const instance = axios.create({
  baseURL: POLARIS_GATEWAY_URL,
  withCredentials: true
});

instance.defaults.headers.common['Content-Type'] = 'application/json';

export const useRequest = () => {
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (
        error.status === 422 &&
        error.request.responseURL.includes('/reclassify-complete')
      ) {
        return Promise.reject(error);
      }
    }
  );

  return instance;
};
