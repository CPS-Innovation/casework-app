import { AxiosInstance } from 'axios';
import { TDeletion } from '../../PdfRedactor/utils/deletionUtils';

export const saveDeletions = async (p: {
  axiosInstance: AxiosInstance;
  urn: string;
  caseId: number;
  versionId: string;
  documentId: string;
  deletions: TDeletion[];
}) => {
  const payload = p.deletions.map((red) => ({
    pageIndex: red.pageNumber,
    operation: 'delete'
  }));

  const response = await p.axiosInstance.post(
    `/api/urns/${p.urn}/cases/${p.caseId}/documents/${p.documentId}/versions/${p.versionId}/redact`,
    payload
  );

  return response.data;
};
