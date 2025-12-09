import useSWR from 'swr';
import { QUERY_KEYS } from '../constants/query.ts';
import { useRequest } from './useRequest.ts';
import { PCDReviewResponseType } from '../schemas/pcdReview.ts';

export const usePCDReview = (historyId?: number) => {
  const request = useRequest();

  const getPCDReview = async (): Promise<PCDReviewResponseType> => {
    return await request
      .get(`cases/:caseId/history/pre-charge-decision`)
      .then((response) => response.data);
  };

  const { data, error, isLoading } = useSWR<PCDReviewResponseType>(
    historyId ? [QUERY_KEYS.PCD_REVIEW_DECISION, historyId] : null,
    getPCDReview
  );

  return { data, error, isLoading };
};
