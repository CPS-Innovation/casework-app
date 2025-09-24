import { AppErrorType } from '../schemas/app';
import { AxiosError } from 'axios';

export const getErrorType = (error?: AxiosError): AppErrorType => {
  const { code, status } = error || {};

  // API not reachable
  if (code === 'ERR_NETWORK') {
    return 'auth';
  }

  if (status === 500) {
    return 'serviceDown';
  }

  // invalid material content
  if (status === 422) {
    return 'materialRetrieval';
  }

  return 'auth';
};
