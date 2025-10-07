import { AxiosError } from 'axios';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import { QUERY_KEYS } from '../constants/query';
import { API_ENDPOINTS, URL } from '../constants/url';
import { ReclassificationContext } from '../context/ReclassificationContext';
import { AutoReclassifyResponseType } from '../schemas/classification';
import { useBanner, useRequest } from './';

export const useAutoReclassify = () => {
  const navigate = useNavigate();
  const request = useRequest();
  const { resetBanner, setBanner } = useBanner();
  const [errorCount, setErrorCount] = useState(0);
  const { mutate } = useSWRConfig();
  // @ts-expect-error need to type ReclassificationContext or get rid eventually
  const { setReclassifiedMaterialIds } = useContext(ReclassificationContext);

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
        const materialsProcessed = data.reclassifiedMaterials.length || 1;
        setReclassifiedMaterialIds(
          data?.reclassifiedMaterials?.map((material) => material?.materialId)
        );

        await mutate(QUERY_KEYS.CASE_MATERIAL);
        setErrorCount(0);
        setBanner({
          type: 'success',
          header: 'Reclassification successful',
          content: `${materialsProcessed} Unused Material${materialsProcessed === 1 ? '' : 's'} reclassified successfully.`
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
