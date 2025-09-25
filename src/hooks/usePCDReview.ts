import useSWR from 'swr';
import { QUERY_KEYS } from '../constants/query';
import { useRequest } from '../hooks/useRequest';
import { PCDReviewResponseType } from '../schemas/pcdReview.ts';

export const usePCDReview = (historyId?: number) => {
  const request = useRequest();

  const getPCDReview = async (): Promise<PCDReviewResponseType> => {
    return await request
      .get(`cases/2147043/history/pre-charge-decision`)
      .then((response) => response.data);
  };

  const { data, error, isLoading } = useSWR<PCDReviewResponseType>(
    historyId ? [QUERY_KEYS.PCD_REVIEW_DECISION, 4239409] : null,
    getPCDReview
  );

  return { data, error, isLoading };
};
