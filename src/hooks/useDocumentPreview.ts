import useSWR from 'swr';
import { QUERY_KEYS } from '../constants/query';
import { POLARIS_GATEWAY_URL } from '../constants/url';
import { CaseMaterialDocumentPreviewResponseType } from '../schemas/caseMaterials';
import { useCaseInfoStore } from '../stores';
import { useRequest } from './useRequest';

type Props = { materialId: number };

export const useDocumentPreview = ({ materialId }: Props) => {
  const request = useRequest();
  const { caseInfo } = useCaseInfoStore();

  const getDocumentPreview = async () =>
    await request
      .get<CaseMaterialDocumentPreviewResponseType>(
        `${POLARIS_GATEWAY_URL}/api/urns/${caseInfo?.urn}/cases/${caseInfo?.id}/materials/${materialId}/preview`,
        { responseType: 'blob' }
      )
      .then((response) => response.data);

  const { data, error, isLoading } = useSWR(
    caseInfo ? `${QUERY_KEYS.CASE_MATERIAL_FULL_DOCUMENT}/${materialId}` : null,
    getDocumentPreview
  );

  return { data, loading: isLoading, error };
};

