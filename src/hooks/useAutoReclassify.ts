import { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';

import { QUERY_KEYS } from '../constants/query';
import { API_ENDPOINTS, URL } from '../constants/url';
import { AutoReclassifyResponseType } from '../schemas/classification';
import { useMaterialTags } from '../stores';
import { useBanner, useRequest } from './';

export const useAutoReclassify = () => {
  const navigate = useNavigate();
  const request = useRequest();
  const { resetBanner, setBanner } = useBanner();
  const [errorCount, setErrorCount] = useState(0);
  const { mutate } = useSWRConfig();
  const { setTags } = useMaterialTags();

  const postAutoReclassify = () => {
    resetBanner();

    return request.post<AutoReclassifyResponseType>(
      API_ENDPOINTS.AUTO_RECLASSIFY
    );
  };

  const { trigger, isMutating, error } = useSWRMutation(
    QUERY_KEYS.AUTO_RECLASSIFY,
    postAutoReclassify,
    {
      onSuccess: async ({ data }) => {
        const totalMaterialsProcessed = data.reclassifiedMaterials.length || 1;
        setTags(
          data?.reclassifiedMaterials?.map((material) => ({
            materialId: material?.materialId,
            tagName: 'Reclassified'
          }))
        );

        await mutate(QUERY_KEYS.CASE_MATERIAL);
        setErrorCount(0);
        setBanner({
          type: 'success',
          header: 'Reclassification successful',
          content: `${totalMaterialsProcessed} Unused Material${totalMaterialsProcessed === 1 ? '' : 's'} reclassified successfully.`
        });

        navigate(URL.MATERIALS, { state: { persistBanner: true } });
      },
      onError: (error: AxiosError) => {
        const totalErrors = errorCount + 1;

        if (error.status === 404) {
          setBanner({
            type: 'important',
            header: 'Important',
            content: 'No materials were identified for reclassification.'
          });
        }

        if (error.status === 500) {
          if (totalErrors < 2) {
            setBanner({
              type: 'error',
              header: 'An error occurred',
              content:
                'There was a problem reclassifying materials. Please try again.'
            });
          } else {
            setBanner({
              type: 'error',
              header: 'An error occurred',
              content:
                'Materials cannot be reclassified automatically. You can still reclassify materials manually.'
            });
          }
        }

        setErrorCount(totalErrors);
      }
    }
  );

  return { errorCount, isPending: isMutating, error, mutate: trigger };
};
