import { QUERY_KEYS } from '../constants/query';
import { API_ENDPOINTS } from '../constants/url';
import { SwrPayload } from '../schemas';
import {
  CaseMaterialReadStatusRequestType,
  CaseMaterialReadStatusResponseType
} from '../schemas/caseMaterials';

import useSWRMutation from 'swr/mutation';
import { useLogger, useRequest } from '.';
import { useCaseInfoStore } from '../stores';

export const useReadStatus = () => {
  const request = useRequest();
  const { caseInfo } = useCaseInfoStore();
  const { log } = useLogger();

  const updateReadStatus = async (
    _url: string,
    { arg: data }: SwrPayload<CaseMaterialReadStatusRequestType>
  ) => {
    return await request.patch<CaseMaterialReadStatusResponseType>(
      API_ENDPOINTS.CASE_MATERIAL_READ_STATUS,
      data
    );
  };

  const { trigger, isMutating, error } = useSWRMutation(
    QUERY_KEYS.READ_STATUS,
    updateReadStatus,
    {
      onSuccess: () => {
        log({
          logLevel: 1,
          message: `HK-UI-FE: caseId ${caseInfo?.id} - Material [id] read status updated`
        });
      },
      onError: (error) => {
        console.error('Error updating material read status', error);
        log({
          logLevel: 3,
          message: 'HK-UI-FE: Error updating material read status',
          errorMessage: 'HK-UI-FE: Error updating material read status'
        });
      }
    }
  );

  return { trigger, isMutating, error };
};
