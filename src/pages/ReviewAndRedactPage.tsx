import { useState } from 'react';
import { CaseDocumentsSelectAccordion } from '../packages/DocumentSelectAccordion/ExampleDocumentSelectAccordion';

export const ReviewAndRedactPage = () => {
  const [openDocumentIds, setOpenDocumentIds] = useState<string[]>([]);

  return (
    <div>
      {/* <pre>{JSON.stringify({ openDocumentIds }, null, 2)}</pre> */}
      <CaseDocumentsSelectAccordion
        urn="54KR7689125"
        caseId={2160797}
        openDocumentIds={openDocumentIds}
        onSetDocumentOpenIds={(docIds) => setOpenDocumentIds(docIds)}
      />
    </div>
  );
};
