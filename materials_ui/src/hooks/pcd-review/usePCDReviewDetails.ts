import useSWR from 'swr';

import { useCaseInfoStore, useRequest } from '..';
import { QUERY_KEYS } from '../../constants/query';
import {
  PCDReviewDetailsResponseType,
  PCDReviewDetailsSchema
} from '../../schemas/pcdReview';

export const usePCDReviewDetails = (historyId: number) => {
  const request = useRequest();
  const { caseInfo } = useCaseInfoStore();

  const getPCDReviewDetails =
    async () => {
      try {
        const response = await request.get(
          `urns/${caseInfo?.urn}/cases/${caseInfo?.id}/history/${historyId}/pcd-review-details`
        );
        const parsedResponse = PCDReviewDetailsSchema.safeParse(response.data);

        if (!parsedResponse.success) {
          throw new Error(parsedResponse.error.message);
        }

        return parsedResponse.data;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to fetch pcd-review-details: ${message}`);
      }
    };

  const { data, error, isLoading, isValidating } =
    useSWR<PCDReviewDetailsResponseType>(
      caseInfo ? [QUERY_KEYS.PCD_REVIEW_REVIEW_DETAILS, historyId] : null,
      getPCDReviewDetails
    );

  return { data, error, isLoading: isLoading || isValidating };
};

