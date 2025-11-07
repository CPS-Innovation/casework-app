import React, { useState } from 'react';
import { TwoCol } from '../../../../components';
import { DocumentSidebar } from '../../../../packages/DocumentSelectAccordion/DocumentSidebar';
import { DocumentControlArea } from '../../documentControlArea';
import { DocumentViewportArea } from '../../documenViewportArea';

const CaseDetailsWrapper: React.FC<{}> = () => {
  const [openDocumentIds, setOpenDocumentIds] = useState<string[]>([]);

  const items = [
    {
      isDirty: false,
      id: 'CMS-MG1',
      versionId: 1,
      label: 'MG1 CARMINE Victim',
      panel: <></>
    },
    {
      isDirty: false,
      id: 'CMS-MG2',
      versionId: 2,
      label: 'MG2 CARMINE Victim',
      panel: <></>
    }
  ];
  return (
    <div className="govuk-main-wrapper">
      <TwoCol
        sidebar={
          <DocumentSidebar
            urn="54KR7689125"
            caseId={2160797}
            openDocumentIds={openDocumentIds}
            onSetDocumentOpenIds={(docIds) => setOpenDocumentIds(docIds)}
          />
        }
      >
        <DocumentControlArea items={items}></DocumentControlArea>
        <DocumentViewportArea></DocumentViewportArea>
      </TwoCol>
    </div>
  );
};

export { CaseDetailsWrapper };
