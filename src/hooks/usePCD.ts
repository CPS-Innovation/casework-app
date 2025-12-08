import useSWR from 'swr';

import { QUERY_KEYS } from '../constants/query';
import { useCaseInfoStore, useRequest } from '../hooks';
import { PCDDetailsResponseType } from '../schemas/pcd';

type UsePCDProps = { pcdId?: string | number };

export const usePCD = ({ pcdId }: UsePCDProps) => {
  const request = useRequest();
  const { caseInfo } = useCaseInfoStore();

  const getPCDDetails = async () =>
    await request
      .get<PCDDetailsResponseType>(
        `urns/${caseInfo?.urn}/cases/${caseInfo?.id}/pcds/${pcdId}/pcd-request`
      )
      .then((response) => response.data);

  const { data, error, isLoading, isValidating } = useSWR(
    caseInfo && pcdId ? `${QUERY_KEYS.PCD_REQUEST}/${pcdId}` : null,
    getPCDDetails
  );

  return { data, error, isLoading: isLoading || isValidating };
};
