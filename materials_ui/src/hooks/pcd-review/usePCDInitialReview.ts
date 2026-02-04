import useSWR from 'swr';

import { useCaseInfoStore, useRequest } from '../';
import { QUERY_KEYS } from '../../constants/query';
import { PCDInitialReviewResponseType } from '../../schemas/pcdReview';

export const usePCDInitialReview = (initialReviewId: number | undefined) => {
  const request = useRequest();
  const { caseInfo } = useCaseInfoStore();

  const getPCDInitialReview =
    async (): Promise<PCDInitialReviewResponseType> => {
      return await request
        .get(
          `urns/${caseInfo?.urn}/cases/${caseInfo?.id}/history/${initialReviewId}/initial-review`
        )
        .then((response) => response.data);
    };

  const { data, error, isLoading, isValidating } =
    useSWR<PCDInitialReviewResponseType>(
      caseInfo && initialReviewId ? QUERY_KEYS.PCD_REVIEW_INITIAL_REVIEW : null,
      getPCDInitialReview
    );

  return { data, error, isLoading: isLoading || isValidating };
};
