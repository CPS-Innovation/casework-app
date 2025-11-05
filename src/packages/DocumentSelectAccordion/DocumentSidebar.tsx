import { useState } from 'react';
import { DocumentSelectAccordion } from './DocumentSelectAccordion';
import {
  documentListSchema,
  useGetCaseDocumentList
} from './getters/useGetCaseDocumentList';

export const DocumentSidebar = (p: {
  urn: string;
  caseId: number;
  openDocumentIds: string[];
  onSetDocumentOpenIds: (docIds: string[]) => void;
}) => {
  const { caseId, urn } = p;
  const documentList = useGetCaseDocumentList({ urn, caseId });
  const [mode, setMode] = useState<
    { mode: 'accordion' } | { mode: 'notes'; documentId: string }
  >({ mode: 'accordion' });

  const parsed = documentListSchema.safeParse(documentList.data);

  if (!parsed.success) return <></>;

  if (mode.mode === 'accordion')
    return (
      <div>
        <DocumentSelectAccordion
          caseId={caseId}
          documentList={documentList.data}
          activeDocumentIds={p.openDocumentIds}
          onSetActiveDocumentIds={(docIds) => {
            p.onSetDocumentOpenIds(docIds);
          }}
          onNotesClick={(docId: string) =>
            setMode({ mode: 'notes', documentId: docId })
          }
        />
      </div>
    );

  if (mode.mode === 'notes') {
    const documentId = mode.documentId;

    return (
      <>
        <button
          onClick={() => {
            setMode({ mode: 'accordion' });
          }}
        >
          go back
        </button>
        {documentId}
      </>
    );
  }
};
