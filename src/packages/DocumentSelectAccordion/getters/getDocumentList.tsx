import { AxiosInstance } from 'axios';
import { useState } from 'react';
import z from 'zod';
import { useAxiosInstance } from './getAxiosInstance';

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

export const getDocumentListFromAxiosInstance = async (p: {
  axiosInstance: AxiosInstance;
  urn: string | undefined;
  caseId: number | undefined;
}) => {
  const response = await p.axiosInstance.get(
    `/api/urns/${p.urn}/cases/${p.caseId}/documents`
  );

  return response.data;
};

export const safeGetDocumentListFromAxiosInstance = async (p: {
  axiosInstance: AxiosInstance;
  urn: string | undefined;
  caseId: number | undefined;
}) => {
  try {
    const resp = await getDocumentListFromAxiosInstance({
      urn: p.urn,
      caseId: p.caseId,
      axiosInstance: p.axiosInstance
    });

    return documentListSchema.safeParse(resp);
  } catch (error) {
    return { success: false } as const;
  }
};

export const useGetDocumentList = () => {
  const axiosInstance = useAxiosInstance();

  const [data, setDocumentList] = useState<TDocumentList | null | undefined>(
    undefined
  );

  const load = async (p: {
    urn: string | undefined;
    caseId: number | undefined;
  }) => {
    const resp = await safeGetDocumentListFromAxiosInstance({
      axiosInstance,
      urn: p.urn,
      caseId: p.caseId
    });
    console.log({ resp });

    setDocumentList(resp.success ? resp.data : null);
  };

  const clear = () => setDocumentList(undefined);

  return { data, reload: load, clear };
};
