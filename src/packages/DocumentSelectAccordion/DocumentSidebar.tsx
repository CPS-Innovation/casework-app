import { useEffect, useState } from 'react';
import { DocumentSidebarAccordion } from './DocumentSidebarAccordion';
import { DocumentSidebarNotes } from './DocumentSidebarNotes';
import { useGetDocumentList } from './getters/getDocumentList';
import { useGetDocumentNotes } from './getters/getDocumentNotes';

export const DocumentSidebar = (p: {
  urn: string;
  caseId: number;
  openDocumentIds: string[];
  onSetDocumentOpenIds: (docIds: string[]) => void;
}) => {
  const { caseId, urn } = p;
  const [status, setStatus] = useState<
    { mode: 'accordion' } | { mode: 'notes'; documentId: string }
  >({ mode: 'accordion' });

  const documentNotes = useGetDocumentNotes();
  useEffect(() => {
    if (status.mode === 'notes') {
      documentNotes.reload({ urn, caseId, documentId: status.documentId });
    }
  }, [status]);

  const documentList = useGetDocumentList();
  useEffect(() => {
    if (status.mode === 'accordion') {
      documentList.reload({ urn, caseId });
      documentNotes.clear();
    }
  }, [status]);

  if (status.mode === 'accordion') {
    if (documentList.data === null) return <div>error</div>;
    if (documentList.data === undefined) return <div>loading</div>;
    return (
      <div>
        <DocumentSidebarAccordion
          caseId={caseId}
          documentList={documentList.data}
          activeDocumentIds={p.openDocumentIds}
          onSetActiveDocumentIds={(docIds) => p.onSetDocumentOpenIds(docIds)}
          onNotesClick={(docId: string) =>
            setStatus({ mode: 'notes', documentId: docId })
          }
        />
      </div>
    );
  }
  if (status.mode === 'notes') {
    const documentId = status.documentId;

    return (
      <DocumentSidebarNotes
        documentId={documentId}
        documentNotes={documentNotes.data}
        caseId={caseId}
        urn={urn}
        onBackButtonClick={() => setStatus({ mode: 'accordion' })}
      />
    );
  }
};
