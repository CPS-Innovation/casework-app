import useSWR from 'swr';
import { QUERY_KEYS } from '../constants/query';
import { API_ENDPOINTS } from '../constants/url';
import { CaseMaterialDocumentPreviewResponseType } from '../schemas/caseMaterials';
import { useRequest } from './useRequest';

type Props = { materialId: number };

export const useDocumentPreview = ({ materialId }: Props) => {
  const request = useRequest();

  const getDocumentPreview = async () =>
    await request
      .get<CaseMaterialDocumentPreviewResponseType>(
        `${API_ENDPOINTS.CASE_MATERIAL_FULL_DOCUMENT}/${materialId}`,
        { responseType: 'blob' }
      )
      .then((response) => response.data);

  const { data, error, isLoading } = useSWR(
    `${QUERY_KEYS.CASE_MATERIAL_FULL_DOCUMENT}/${materialId}`,
    getDocumentPreview
  );

  return { data, loading: isLoading, error };
};
