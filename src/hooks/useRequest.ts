import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000',
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
