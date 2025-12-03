import { AxiosInstance } from 'axios';
import { TRedaction } from '../../PdfRedactor/utils/coordUtils';

export const saveRedactions = async (
  urn: string,
  caseId: number,
  documentId: string,
  versionId: number,
  redactionSaveRequest: RedactionSaveRequest
) => {
  const url = fullUrl(
    `/api/urns/${urn}/cases/${caseId}/documents/${documentId}/versions/${versionId}/redact`
  );

  const response = await fetchImplementation('proactive-reauth', url, {
    headers: await buildHeaders(),
    method: 'PUT',
    body: JSON.stringify(redactionSaveRequest)
  });

  if (!response.ok) {
    throw new ApiError('Save redactions failed', url, response);
  }
};

export const getDocumentNotesFromAxiosInstance = async (p: {
  axiosInstance: AxiosInstance;
  urn: string;
  caseId: number;
  versionId: string;
  documentId: string;
  redactions: TRedaction[];
}) => {
  const payload = p.redactions.map((red) => ({
    pageIndex: red.pageNumber,
    height: red.pageHeight,
    width: red.pageWidth,
    redactionCoordinates: [{ x1: red.x1, y1: red.y1, x2: red.x2, y2: red.y2 }]
  }));
  const response = await p.axiosInstance.post(
    `/api/urns/${p.urn}/cases/${p.caseId}/documents/${p.documentId}/notes`,
    payload
  );

  return response.data;
};
