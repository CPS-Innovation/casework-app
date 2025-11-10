import { useState } from 'react';
import { TwoCol } from '../../components';
import { DocumentSidebar } from '../../packages/DocumentSelectAccordion/DocumentSidebar';
import { DocumentControlArea } from '../components/documentControlArea';
import { DocumentViewportArea } from '../components/documenViewportArea';

export const ReviewAndRedactPage = () => {
  const [openDocumentIds, setOpenDocumentIds] = useState<string[]>([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);

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
          isSidebarVisible ? (
            <DocumentSidebar
              urn="54KR7689125"
              caseId={2160797}
              openDocumentIds={openDocumentIds}
              onSetDocumentOpenIds={(docIds) => setOpenDocumentIds(docIds)}
            />
          ) : undefined
        }
      >
        <>
          <DocumentControlArea
            items={items}
            isSidebarVisible={isSidebarVisible}
            onToggleSidebar={() => setIsSidebarVisible((v) => !v)}
          />

          <DocumentViewportArea></DocumentViewportArea>
        </>
      </TwoCol>
    </div>
  );
};

