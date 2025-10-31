import { PropsWithChildren, createContext, useState } from 'react';
import { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import { QUERY_KEYS } from '../constants/query';
import { API_ENDPOINTS } from '../constants/url.ts';
import { useBanner, useRequest } from '../hooks';
import { AutoReclassifyResponseType } from '../schemas/classification';
import { useMaterialTags } from '../stores';

// @ts-expect-error fix this later
export const ReclassificationContext = createContext();

export const ReclassificationProvider = ({ children }: PropsWithChildren) => {
  const [reclassificationLoading, setReclassificationLoading] = useState(false);
  const [reclassifiedMaterialCount, setReclassifiedMaterialCount] = useState(0);
  const [bannerStatus, setBannerStatus] = useState<number | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  const { resetBanner, setBanner } = useBanner();
  const { mutate } = useSWRConfig();
  const request = useRequest();
  const { setTags } = useMaterialTags();

  const requestAutoReclassify = () =>
    request.post<AutoReclassifyResponseType>(API_ENDPOINTS.AUTO_RECLASSIFY);

  const { trigger, isMutating } = useSWRMutation(
    QUERY_KEYS.AUTO_RECLASSIFY,
    requestAutoReclassify,
    {
      onSuccess: ({ data }) => {
        console.log(data);
      }
    }
  );

  const handleReclassifyClick = async () => {
    setReclassificationLoading(isMutating);
    resetBanner();

    try {
      const response = await trigger();

      if (response.status === 404) {
        setBannerStatus(404);
        setBanner({
          type: 'important',
          header: 'Important',
          content: 'No materials were identified for reclassification.'
        });
      } else if (response.status === 422 || response.status === 500) {
        setErrorCount((prevCount) => prevCount + 1);
        setBannerStatus(500);
      } else {
        setBannerStatus(response.status);
      }

      const result = response?.data;

      if (result.status === 'success') {
        setReclassifiedMaterialCount(result.reclassifiedMaterials.length);
        setTags(
          result?.reclassifiedMaterials.map((item) => ({
            materialId: +item.materialId,
            tagName: 'Reclassified'
          }))
        );
        setBannerStatus(200);

        setBanner({
          type: 'success',
          header: 'Reclassification successful',
          content: `${result?.reclassifiedMaterials?.length} Unused Materials reclassified successfully.`
        });
      } else {
        setBannerStatus(response.status);
      }

      await mutate(QUERY_KEYS.CASE_MATERIAL);
    } catch (error) {
      console.error('Error reclassifying materials:', error);
      setErrorCount((prevCount) => prevCount + 1);
      setBannerStatus(500);

      setBanner({
        type: 'error',
        header: 'An error occurred',
        content:
          errorCount === 1
            ? 'There was a problem reclassifying materials. Please try again.'
            : 'Materials cannot be reclassified automatically. You can still reclassify materials manually.'
      });
    } finally {
      setReclassificationLoading(false);
    }
  };

  return (
    <ReclassificationContext.Provider
      value={{
        reclassificationLoading,
        reclassifiedMaterialCount,
        bannerStatus,
        errorCount,
        setReclassificationLoading,
        setReclassifiedMaterialCount,
        handleReclassifyClick,
        setBannerStatus
      }}
    >
      {children}
    </ReclassificationContext.Provider>
  );
};
