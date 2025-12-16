import useSWR from 'swr';

import { useCaseInfoStore, useRequest } from '../';
import { QUERY_KEYS } from '../../constants/query';
import { PCDReviewResponseType } from '../../schemas/pcdReview';

export const usePCDReview = (historyId?: number) => {
  const request = useRequest();
  const { caseInfo } = useCaseInfoStore();

  const getPCDReview = async (): Promise<PCDReviewResponseType> => {
    return await request
      .get(
        `urns/${caseInfo?.urn}/cases/${caseInfo?.id}/history/${historyId}/pre-charge-decision`
      )
      .then((response) => response.data);
  };

  const { data, error, isLoading, isValidating } =
    useSWR<PCDReviewResponseType>(
      caseInfo && historyId
        ? [QUERY_KEYS.PCD_REVIEW_DECISION, historyId]
        : null,
      getPCDReview
    );

  return { data, error, isLoading: isLoading || isValidating };
};
