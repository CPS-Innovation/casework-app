import { AxiosError } from 'axios';
import useSWRMutation from 'swr/mutation';
import { QUERY_KEYS } from '../constants/query.ts';
import { API_ENDPOINTS } from '../constants/url.ts';
import { SwrPayload } from '../schemas/api.ts';
import {
  CaseMaterialDiscardRequestType,
  CaseMaterialDiscardResponseType,
  CaseMaterialsType
} from '../schemas/caseMaterials.ts';
import { useCaseInfoStore, useLogger, useRequest } from './index.ts';

export type UseDiscardOptions = {
  onError?: () => void;
  onSuccess?: () => void;
};

export const useDiscard = (
  material?: CaseMaterialsType,
  options?: UseDiscardOptions
) => {
  const request = useRequest();
  const { caseInfo } = useCaseInfoStore();
  const { log } = useLogger();

  const discardMaterialRequest = async (
    _url: string,
    { arg: data }: SwrPayload<CaseMaterialDiscardRequestType>
  ) => {
    return await request.patch<CaseMaterialDiscardResponseType>(
      API_ENDPOINTS.CASE_MATERIAL_DISCARD,
      data
    );
  };

  const { trigger, isMutating, error } = useSWRMutation(
    QUERY_KEYS.CASE_MATERIAL_DISCARD,
    discardMaterialRequest,
    {
      onSuccess: () => {
        if (options?.onSuccess) {
          options?.onSuccess();
        }

        console.log('Material discarded');
        log({
          logLevel: 1,
          message: `HK-UI-FE: caseId ${caseInfo?.id} - Material [${material?.materialId}] discarded`,
          errorMessage: ''
        });
      },
      onError: (error: AxiosError) => {
        if (options?.onError) {
          options?.onError();
        }

        console.error('Error discarding material read status', error);
        log({
          logLevel: 3,
          message: `HK-UI-FE: Error discarding material ${material?.materialId}`,
          errorMessage: `HK-UI-FE: Error discarding material ${material?.materialId}`
        });
      }
    }
  );

  return { isLoading: isMutating, trigger, error };
};
