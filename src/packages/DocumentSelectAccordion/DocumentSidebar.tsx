import { useState } from 'react';
import { DocumentSidebarAccordion } from './DocumentSidebarAccordion';
import { DocumentSidebarNotes } from './DocumentSidebarNotes';
import { useGetDocumentList } from './getters/getDocumentList';

export const DocumentSidebar = (p: {
  urn: string;
  caseId: number;
  openDocumentIds: string[];
  onSetDocumentOpenIds: (docIds: string[]) => void;
}) => {
  const { caseId, urn } = p;
  const { documentList } = useGetDocumentList({ urn, caseId });
  const [mode, setMode] = useState<
    { mode: 'accordion' } | { mode: 'notes'; documentId: string }
  >({ mode: 'accordion' });

  if (documentList === null) return <div>error</div>;
  if (documentList === undefined) return <div>loading</div>;

  if (mode.mode === 'accordion')
    return (
      <div>
        <DocumentSidebarAccordion
          caseId={caseId}
          documentList={documentList}
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
      <DocumentSidebarNotes
        documentId={documentId}
        caseId={caseId}
        urn={urn}
        onBackButtonClick={() => setMode({ mode: 'accordion' })}
      />
    );
  }
};
