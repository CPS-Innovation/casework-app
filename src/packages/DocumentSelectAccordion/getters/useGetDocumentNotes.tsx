import { AxiosInstance } from 'axios';
import z from 'zod';

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
  const resp = await getDocumentNotesFromAxiosInstance({
    urn: p.urn,
    caseId: p.caseId,
    documentId: p.documentId,
    axiosInstance: p.axiosInstance
  });

  return documentNotesSchema.safeParse(resp);
};

// export const useGetDocumentNotes = (p: {
//   urn: string | undefined;
//   caseId: number | undefined;
//   documentId: string | undefined;
// }) => {
//   const axiosInstance = useAxiosInstance();

//   const { data, error, isLoading } = useSWR(
//     `getDocumentNotes-${p.urn}-${p.caseId}-${p.documentId}`,
//     () => getDocumentNotesFromAxiosInstance({ axiosInstance, ...p })
//   );

//   return { data, error, isLoading };
// };
