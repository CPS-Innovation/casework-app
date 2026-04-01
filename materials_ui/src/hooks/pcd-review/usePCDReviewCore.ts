import useSWR from 'swr';

import { useCaseInfoStore, useRequest } from '..';
import { QUERY_KEYS } from '../../constants/query';
import { PCDReviewCoreResponseType } from '../../schemas/pcdReview';

export const usePCDReviewCore = () => {
  const request = useRequest();
  const { caseInfo } = useCaseInfoStore();

  const getPCDReviewCore =
    async (): Promise<PCDReviewCoreResponseType> => {
      return await request
        .get(
          `urns/${caseInfo?.urn}/cases/${caseInfo?.id}/pcd-review-core`
        )
        .then((response) => response.data);
    };

  const { data, error, isLoading, isValidating } =
    useSWR<PCDReviewCoreResponseType>(
      caseInfo ? QUERY_KEYS.PCD_REVIEW_CORE : null,
      getPCDReviewCore
    );

  return { data, error, isLoading: isLoading || isValidating };
};

