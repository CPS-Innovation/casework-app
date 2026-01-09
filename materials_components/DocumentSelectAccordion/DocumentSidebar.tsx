import { useEffect, useState } from 'react';
import { useTriggerListener } from '../PdfRedactor/utils/useTriggger';
import { DocumentSidebarAccordion } from './DocumentSidebarAccordion';
import { DocumentSidebarNotes } from './DocumentSidebarNotes';
import { TDocument, useGetDocumentList } from './getters/getDocumentList';

export const DocumentSidebar = (p: {
  urn: string;
  caseId: number;
  openDocumentIds: string[];
  onSetDocumentOpenIds: (docIds: string[]) => void;
  reloadTriggerData: [] | undefined;
  ActionComponent?: (p: { document: TDocument }) => React.ReactNode;
}) => {
  const { caseId, urn } = p;
  const [status, setStatus] = useState<
    { mode: 'accordion' } | { mode: 'notes'; documentId: string }
  >({ mode: 'accordion' });

  useTriggerListener({
    triggerData: p.reloadTriggerData,
    fn: () => documentList.reload({ urn, caseId })
  });

  const documentList = useGetDocumentList();
  useEffect(() => {
    if (status.mode === 'accordion') documentList.reload({ urn, caseId });
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
          ActionComponent={p.ActionComponent}
        />
      </div>
    );
  }
  if (status.mode === 'notes') {
    const documentId = status.documentId;

    return (
      <DocumentSidebarNotes
        documentId={documentId}
        caseId={caseId}
        urn={urn}
        onBackButtonClick={() => setStatus({ mode: 'accordion' })}
      />
    );
  }
};
