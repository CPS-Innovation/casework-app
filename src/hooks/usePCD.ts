import { useRequest } from '../hooks';

import { replaceTokens } from '../utils/string';
import { API_ENDPOINTS } from '../constants/url';
import { QUERY_KEYS } from '../constants/query';
import { PCDDetailsResponseType } from '../schemas/pcd';
import useSWR from 'swr';

type UsePCDProps = { caseId?: string | number; pcdId?: string | number };

export const usePCD = ({ caseId, pcdId }: UsePCDProps) => {
  const request = useRequest();

  const getPCDDetails = async () =>
    await request
      .get<PCDDetailsResponseType>(
        replaceTokens(API_ENDPOINTS.PCD_REQUEST_DETAILS, {
          caseId: caseId || '',
          pcdId: pcdId || ''
        })
      )
      .then((response) => response.data);

  const { data, error, isLoading } = useSWR(
    caseId && pcdId ? `${QUERY_KEYS.PCD_REQUEST}/${pcdId}` : null,
    getPCDDetails
  );

  return { data, error, isLoading };
};
