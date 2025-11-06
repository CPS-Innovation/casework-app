import { AxiosInstance } from 'axios';
import useSWR from 'swr';
import z from 'zod';
import { useAxiosInstance } from './useAxiosInstance';

export const getDocumentListFromAxiosInstance = async (p: {
  axiosInstance: AxiosInstance;
  urn: string | undefined;
  caseId: number | undefined;
}) => {
  const response = await p.axiosInstance.get(
    `/api/urns/${p.urn}/cases/${p.caseId}/documents`
  );
  console.log(response.data);

  return response.data;
};

export const useGetDocumentList = (p: {
  urn: string | undefined;
  caseId: number | undefined;
}) => {
  const axiosInstance = useAxiosInstance();

  const { data, error, isLoading } = useSWR('getCaseDocumentList', () => {
    return getDocumentListFromAxiosInstance({ axiosInstance, ...p });
  });

  return { data, error, isLoading };
};

export const documentSchema = z
  .object({
    documentId: z.string(),
    status: z.string(),
    cmsDocType: z.object({
      documentTypeId: z.number(),
      documentType: z.string().nullish(),
      documentCategory: z.string()
    }),
    cmsOriginalFileName: z.string(),
    presentationTitle: z.string(),
    isUnused: z.boolean(),
    hasNotes: z.boolean()
  })
  .brand<'TDocument'>();
export const documentListSchema = z.array(documentSchema);
export type TDocument = z.infer<typeof documentSchema>;
export type TDocumentList = TDocument[];
