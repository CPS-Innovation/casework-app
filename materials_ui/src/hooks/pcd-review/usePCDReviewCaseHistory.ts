import useSWR from 'swr';

import { useCaseInfoStore, useRequest } from '../';
import { PcdReviewCaseHistoryType } from '../../constants/enum';
import { QUERY_KEYS } from '../../constants/query';
import { CaseHistoryResponseType } from '../../schemas/pcdReview';

export const usePCDReviewCaseHistory = () => {
  const request = useRequest();
  const { caseInfo } = useCaseInfoStore();

  const getPCDReview = async (): Promise<CaseHistoryResponseType[]> => {
    return await request
      .get(`urns/${caseInfo?.urn}/cases/${caseInfo?.id}/history`)
      .then((response) =>
        response.data.filter(
          (str: { type: number }) =>
            str.type === PcdReviewCaseHistoryType.InitialReview ||
            str.type === PcdReviewCaseHistoryType.PreChargeDecision
        )
      );
  };

  const { data, error, isLoading, isValidating } = useSWR<
    CaseHistoryResponseType[]
  >(caseInfo ? QUERY_KEYS.PCD_REVIEW_CASE_HISTORY : null, getPCDReview);

  return { data, error, isLoading: isLoading || isValidating };
};
