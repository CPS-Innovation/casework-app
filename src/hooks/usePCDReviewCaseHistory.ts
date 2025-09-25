import useSWR from 'swr';
import { PcdReviewCaseHistoryType } from '../constants/enum.ts';
import { QUERY_KEYS } from '../constants/query.ts';
import { API_ENDPOINTS } from '../constants/url.ts';
import { useRequest } from '../hooks/useRequest.ts';
import { CaseHistoryResponseType } from '../schemas/pcdReview.ts';
import { replaceTokens } from '../utils/string.ts';

export const usePCDReviewCaseHistory = () => {
  const request = useRequest();

  const getPCDReview = async (): Promise<CaseHistoryResponseType[]> => {
    return await request
      .get(
        replaceTokens(API_ENDPOINTS.PCD_REVIEW_CASE_HISTORY, {
          caseId: '2147043'
        })
      )
      .then((response) =>
        response.data.filter(
          (str: { type: number }) =>
            str.type === PcdReviewCaseHistoryType.InitialReview ||
            str.type === PcdReviewCaseHistoryType.PreChargeDecision
        )
      );
  };

  const { data, error, isLoading } = useSWR<CaseHistoryResponseType[]>(
    QUERY_KEYS.PCD_REVIEW_CASE_HISTORY,
    getPCDReview
  );

  return { data, error, isLoading };
};
