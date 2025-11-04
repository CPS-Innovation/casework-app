import { useState } from 'react';
import { CaseDocumentsSelectAccordion } from '../packages/DocumentSelectAccordion/ExampleDocumentSelectAccordion';

export const ReviewAndRedactPage = () => {
  const [openDocumentIds, setOpenDocumentIds] = useState<string[]>([]);

  return (
    <div>
      <button
        onClick={() => {
          setOpenDocumentIds([]);
        }}
      >
        click me
      </button>
      <CaseDocumentsSelectAccordion
        urn="54KR7689125"
        caseId={2160797}
        openDocumentIds={openDocumentIds}
        onSetDocumentOpenIds={(docIds) => setOpenDocumentIds(docIds)}
      />
    </div>
  );
};
