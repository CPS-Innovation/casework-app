import useSWR from 'swr';
import { useCaseInfoStore } from '../stores';
import { useRequest } from './useRequest';

export const useSearchTracker = (trigger: any) => {
  const request = useRequest();
  const { caseInfo } = useCaseInfoStore();

  const urn = caseInfo?.urn;
  const caseId = caseInfo?.id.toString();

  const postInit = () => request.post(`/urns/${urn}/cases/${caseId}`);

  const getTracker = () => request.get(`/urns/${urn}/cases/${caseId}/tracker`);

  // Start pipeline when a new trigger comes in
  const { data: postData } = useSWR(
    trigger ? ['tracker-init', urn, caseId, trigger] : null,
    postInit,
    { revalidateOnFocus: false }
  );

  // Poll until Completed
  const { data: trackerData, isLoading: trackerLoading } = useSWR(
    postData ? ['tracker-status', urn, caseId, trigger] : null,
    getTracker,
    {
      refreshInterval: (latest) =>
        latest?.data.status === 'Running' ? 1000 : 0,
      dedupingInterval: 0,
      revalidateOnFocus: false
    }
  );

  const isComplete =
    trackerData?.data.status === 'Completed' ||
    trackerData?.data.status === 'DocumentsRetrieved';

  return { trackerData, trackerLoading, isComplete };
};
