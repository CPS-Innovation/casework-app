import { AxiosError } from 'axios';
import useSWRMutation from 'swr/mutation';

import { QUERY_KEYS } from '../constants/query';
import { API_ENDPOINTS } from '../constants/url';
import { AutoReclassifyResponseType } from '../schemas/classification';
import { useRequest } from '.';

type UseAutoReclassifyProps = {
  onError: (error: AxiosError) => void;
  onSuccess: (response: AutoReclassifyResponseType) => void;
};

export const useAutoReclassify = (options?: UseAutoReclassifyProps) => {
  const request = useRequest();

  const postAutoReclassify = () =>
    request.post<AutoReclassifyResponseType>(API_ENDPOINTS.AUTO_RECLASSIFY);

  const { trigger, isMutating, error } = useSWRMutation(
    QUERY_KEYS.AUTO_RECLASSIFY,
    postAutoReclassify,
    {
      onSuccess: async (response) => {
        if (options?.onSuccess) {
          options.onSuccess(response.data);
        }
      },
      onError: (error: AxiosError) => {
        if (options?.onError) {
          options.onError(error);
        }
      }
    }
  );

  return { isPending: isMutating, error, mutate: trigger };
};
