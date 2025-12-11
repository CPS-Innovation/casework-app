import useSWR from 'swr';
import { useRequest } from '../';
import { QUERY_KEYS } from '../../constants/query.ts';
import { PCDReviewResponseType } from '../../schemas/pcdReview.ts';

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
