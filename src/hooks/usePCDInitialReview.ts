import useSWR from 'swr';
import { QUERY_KEYS } from '../constants/query.ts';
import { API_ENDPOINTS } from '../constants/url';
import { useRequest } from '../hooks';
import { PCDInitialReviewResponseType } from '../schemas/pcdReview.ts';
import { replaceTokens } from '../utils/string';

export const usePCDInitialReview = () => {
  const request = useRequest();

  const getPCDInitialReview =
    async (): Promise<PCDInitialReviewResponseType> => {
      return await request
        .get(
          replaceTokens(API_ENDPOINTS.PCD_REVIEW_INITIAL_REVIEW, {
            caseId: '2147043'
          })
        )
        .then((response) => response.data);
    };

  const { data, error, isLoading } = useSWR<PCDInitialReviewResponseType>(
    QUERY_KEYS.PCD_REVIEW_INITIAL_REVIEW,
    getPCDInitialReview
  );

  return { data, error, isLoading };
};
