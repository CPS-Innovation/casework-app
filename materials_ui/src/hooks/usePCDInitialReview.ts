import useSWR from 'swr';
import { QUERY_KEYS } from '../constants/query.ts';
import { useRequest } from './index.ts';
import { PCDInitialReviewResponseType } from '../schemas/pcdReview.ts';
import { replaceTokens } from '../utils/string.ts';

export const usePCDInitialReview = () => {
  const request = useRequest();

  const getPCDInitialReview =
    async (): Promise<PCDInitialReviewResponseType> => {
      return await request
        .get(
          replaceTokens(
            'http://localhost:3000/cases/:caseId/history/initial-review',
            { caseId: '2147043' }
          )
        )
        .then((response) => response.data);
    };

  const { data, error, isLoading } = useSWR<PCDInitialReviewResponseType>(
    QUERY_KEYS.PCD_REVIEW_INITIAL_REVIEW,
    getPCDInitialReview
  );

  return { data, error, isLoading };
};
