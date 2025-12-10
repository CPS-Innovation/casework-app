import useSWR from 'swr';
import { useRequest } from '../';
import { PcdReviewCaseHistoryType } from '../../constants/enum.ts';
import { QUERY_KEYS } from '../../constants/query.ts';
import { CaseHistoryResponseType } from '../../schemas/pcdReview.ts';
import { replaceTokens } from '../../utils/string.ts';

export const usePCDReviewCaseHistory = () => {
  const request = useRequest();

  const getPCDReview = async (): Promise<CaseHistoryResponseType[]> => {
    return await request
      .get(
        replaceTokens('http://localhost:3000/cases/:caseId/history', {
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
