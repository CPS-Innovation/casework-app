import { AxiosError } from 'axios';
import useSWRMutation from 'swr/mutation';
import { QUERY_KEYS } from '../constants/query';
import { API_ENDPOINTS } from '../constants/url';
import { useBanner, useLogger, useRequest } from '../hooks';
import { SwrPayload } from '../schemas';
import {
  BulkSetUnusedRequestType,
  BulkSetUnusedResponseType
} from '../schemas/bulkSetUnused';

type UseBulkSetUnusedOptions = {
  onError?: (error: AxiosError) => void;
  onSuccess?: (response: { data: BulkSetUnusedResponseType }) => void;
};

export const useBulkSetUnused = ({
  onError,
  onSuccess
}: UseBulkSetUnusedOptions) => {
  const request = useRequest();
  const { resetBanner } = useBanner();
  const { log } = useLogger();

  const postBulkSetUnused = async (
    _url: string,
    { arg: data }: SwrPayload<BulkSetUnusedRequestType>
  ) => {
    resetBanner();

    return request
      .post<BulkSetUnusedResponseType>(
        API_ENDPOINTS.CASE_MATERIAL_BULK_SET_UNUSED,
        data
      )
      .then((response) => response);
  };

  const { trigger, isMutating, error, data } = useSWRMutation(
    QUERY_KEYS.BULK_SET_UNUSED,
    postBulkSetUnused,
    {
      onSuccess,
      onError: (error: AxiosError) => {
        if (onError) {
          onError(error);
        }

        log({
          logLevel: 3,
          message:
            'HK-UI-FE: Failed to update status to Unused for selected materials.'
        });
      }
    }
  );

  return { trigger, isMutating, error, data };
};
