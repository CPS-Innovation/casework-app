import { useState } from 'react';
import { DocumentSidebar } from '../packages/DocumentSelectAccordion/DocumentSidebar';

export const ReviewAndRedactPage = () => {
  const [openDocumentIds, setOpenDocumentIds] = useState<string[]>([]);

  return (
    <div>
      <DocumentSidebar
        urn="54KR7689125"
        caseId={2160797}
        openDocumentIds={openDocumentIds}
        onSetDocumentOpenIds={(docIds) => setOpenDocumentIds(docIds)}
      />
      <br />
    </div>
  );
};
