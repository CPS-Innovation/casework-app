import useSWRMutation from 'swr/mutation';
import { QUERY_KEYS } from '../constants/query';
import { API_ENDPOINTS } from '../constants/url';
import { useLogger, useRequest } from '../hooks';
import { SwrPayload } from '../schemas';
import {
  CaseMaterialRenameResponseType,
  CaseMaterialsType
} from '../schemas/caseMaterials.ts';
import { useCaseInfoStore } from '../stores';

type UseRenameOptions = {
  onError?: (error: Error) => void;
  onSuccess?: () => void;
};

export const useRename = (
  material: CaseMaterialsType | null,
  options?: UseRenameOptions
) => {
  const request = useRequest();
  const { caseInfo } = useCaseInfoStore();
  const { log } = useLogger();

  const renameMaterialRequest = (
    _url: string,
    { arg: newSubject }: SwrPayload<string>
  ) => {
    return request.patch<CaseMaterialRenameResponseType>(
      API_ENDPOINTS.CASE_MATERIAL_RENAME,
      { materialId: material?.materialId, subject: newSubject }
    );
  };
  const { trigger, isMutating } = useSWRMutation(
    QUERY_KEYS.RENAME_MATERIAL,
    renameMaterialRequest,
    {
      onError: (error: Error) => {
        if (options?.onError) options?.onError(error);
        window.scrollTo(0, 0);

        console.error('Error renaming material:', error);
        log({
          logLevel: 1,
          message: `HK-UI-FE: caseId [${caseInfo?.id}] - materialID [${material?.materialId}] has not been renamed.`
        });
      },
      onSuccess: () => {
        if (options?.onSuccess) options.onSuccess();
        window.scrollTo(0, 0);

        log({
          logLevel: 1,
          message: `HK-UI-FE: caseId [${caseInfo?.id}] - materialID [${material?.materialId}] has been renamed.`
        });
      }
    }
  );

  return { trigger, isMutating };
};
