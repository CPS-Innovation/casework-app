import useSWR from 'swr';

import { useCaseInfoStore, useRequest } from '..';
import { QUERY_KEYS } from '../../constants/query';
import { PCDReviewDetailsResponseType } from '../../schemas/pcdReview';

export const usePCDReviewDetails = (historyId: number) => {
  const request = useRequest();
  const { caseInfo } = useCaseInfoStore();

  const getPCDReviewDetails =
    async (): Promise<PCDReviewDetailsResponseType> => {
      return await request
        .get(
          `urns/${caseInfo?.urn}/cases/${caseInfo?.id}/history/${historyId}/pcd-review-details`
        )
        .then((response) => response.data);
    };

  const { data, error, isLoading, isValidating } =
    useSWR<PCDReviewDetailsResponseType>(
      caseInfo && historyId ? [QUERY_KEYS.PCD_REVIEW_REVIEW_DETAILS, historyId] : null,
      getPCDReviewDetails
    );

  return { data, error, isLoading: isLoading || isValidating };
};

