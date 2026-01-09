import { AxiosInstance } from 'axios';
import { useState } from 'react';
import z from 'zod';
import { useAxiosInstance } from './getAxiosInstance';

const documentNoteSchema = z.object({
  createdByName: z.string(),
  date: z.string(),
  text: z.string()
});
const documentNotesSchema = z.array(documentNoteSchema);

export type TDocumentNote = z.infer<typeof documentNoteSchema>;
export type TDocumentNotes = z.infer<typeof documentNotesSchema>;

export const postDocumentNotesFromAxiosInstance = async (p: {
  axiosInstance: AxiosInstance;
  urn: string | undefined;
  documentId: string | undefined;
  caseId: number | undefined;
  text: string;
}) => {
  const response = await p.axiosInstance.post(
    `/api/urns/${p.urn}/cases/${p.caseId}/documents/${p.documentId}/notes`,
    { Text: p.text }
  );

  return response.data;
};

export const getDocumentNotesFromAxiosInstance = async (p: {
  axiosInstance: AxiosInstance;
  urn: string | undefined;
  documentId: string | undefined;
  caseId: number | undefined;
}) => {
  const response = await p.axiosInstance.get(
    `/api/urns/${p.urn}/cases/${p.caseId}/documents/${p.documentId}/notes`
  );

  return response.data;
};

export const safeGetDocumentNotesFromAxiosInstance = async (p: {
  axiosInstance: AxiosInstance;
  urn: string | undefined;
  documentId: string | undefined;
  caseId: number | undefined;
}) => {
  try {
    const resp = await getDocumentNotesFromAxiosInstance({
      urn: p.urn,
      caseId: p.caseId,
      documentId: p.documentId,
      axiosInstance: p.axiosInstance
    });

    return documentNotesSchema.safeParse(resp);
  } catch (error) {
    return { success: false } as const;
  }
};

export const useGetDocumentNotes = () => {
  const axiosInstance = useAxiosInstance();
  const [data, setDocumentNotes] = useState<TDocumentNotes | null | undefined>(
    undefined
  );

  const load = async (p: {
    urn: string | undefined;
    caseId: number | undefined;
    documentId: string | undefined;
  }) => {
    const resp = await safeGetDocumentNotesFromAxiosInstance({
      axiosInstance,
      urn: p.urn,
      caseId: p.caseId,
      documentId: p.documentId
    });

    setDocumentNotes(resp.success ? resp.data : null);
  };

  const clear = () => setDocumentNotes(undefined);

  return { data, reload: load, clear };
};
