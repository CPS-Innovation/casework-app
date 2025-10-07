// @ts-nocheck
import { PropsWithChildren, createContext, useState } from 'react';
import { QUERY_KEYS } from '../constants/query';
import { useBanner, useRequest } from '../hooks';
import { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import { API_ENDPOINTS } from '../constants/url.ts';
import { AutoReclassifyResponseType } from '../schemas/classification.ts';

export const ReclassificationContext = createContext();

export const ReclassificationProvider = ({ children }: PropsWithChildren) => {
  const [reclassificationLoading, setReclassificationLoading] = useState(false);
  const [reclassifiedMaterialCount, setReclassifiedMaterialCount] = useState(0);
  const [reclassifiedMaterialIds, setReclassifiedMaterialIds] = useState([]);
  const [bannerStatus, setBannerStatus] = useState<number | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  const { resetBanner, setBanner } = useBanner();
  const { mutate } = useSWRConfig();
  const request = useRequest();

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

      if (!response.ok) {
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
        return;
      }

      const result = await response.json();

      if (result.status === 'success') {
        setReclassifiedMaterialCount(result.reclassifiedMaterials.length);
        setReclassifiedMaterialIds(
          result.reclassifiedMaterials.map((item) => item.materialId)
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
        reclassifiedMaterialIds,
        bannerStatus,
        errorCount,
        setReclassificationLoading,
        setReclassifiedMaterialCount,
        setReclassifiedMaterialIds,
        handleReclassifyClick,
        setBannerStatus
      }}
    >
      {children}
    </ReclassificationContext.Provider>
  );
};
