import { AxiosInstance } from 'axios';
import { TRedaction } from '../../PdfRedactor/utils/coordUtils';

export const saveRedactions = async (p: {
  axiosInstance: AxiosInstance;
  urn: string;
  caseId: number;
  versionId: number;
  documentId: string;
  redactions: TRedaction[];
}) => {
  const payload = {
    redactions: p.redactions.map((red) => ({
      pageIndex: red.pageNumber,
      height: red.pageHeight,
      width: red.pageWidth,
      redactionCoordinates: [{ x1: red.x1, y1: red.y1, x2: red.x2, y2: red.y2 }]
    })),
    documentModifications: []
  };
  const response = await p.axiosInstance.put(
    `/api/urns/${p.urn}/cases/${p.caseId}/documents/${p.documentId}/versions/${p.versionId}/redact`,
    payload
  );

  console.log(response);

  return response.data;
};
