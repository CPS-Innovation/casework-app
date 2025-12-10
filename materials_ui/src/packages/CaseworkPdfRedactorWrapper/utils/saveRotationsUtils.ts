import { AxiosInstance } from 'axios';
import { TRotation } from '../../PdfRedactor/utils/rotationUtils';

export const saveRotations = async (p: {
  axiosInstance: AxiosInstance;
  urn: string;
  caseId: number;
  versionId: number;
  documentId: string;
  rotations: TRotation[];
}) => {
  const payload = {
    documentModifications: p.rotations.map((red) => ({
      pageIndex: red.pageNumber,
      operation: 'rotate',
      arg: `${red.rotationDegrees}`
    }))
  };

  const response = await p.axiosInstance.put(
    `/api/urns/${p.urn}/cases/${p.caseId}/documents/${p.documentId}/versions/${p.versionId}/modify`,
    payload
  );

  return response.data;
};
