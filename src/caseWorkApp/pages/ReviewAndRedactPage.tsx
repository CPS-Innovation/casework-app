import { useEffect, useState } from 'react';
import { TwoCol } from '../../components';
import { DocumentSidebar } from '../../packages/DocumentSelectAccordion/DocumentSidebar';
import { DocumentControlArea } from '../components/documentControlArea';
import { DocumentViewportArea } from '../components/documenViewportArea';

export const ReviewAndRedactPage = () => {
  const [openDocumentIds, setOpenDocumentIds] = useState<string[]>([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const [documentIDs, setDocumentIDs] = useState<any[]>([]);
  const [removedDocumentId, setRemovedDocumentId] = useState<{
    id: string;
    label: string;
    title: string;
  } | undefined>(undefined);

  const handleCloseTab = (v: string) => {
    setRemovedDocumentId(v as any);
  };

  useEffect(() => {
    const res = openDocumentIds?.map((item) => {
      return { id: item, label: item, title: item };
    });

    setDocumentIDs(res);
  }, [openDocumentIds]);

  useEffect(() => {
    const newArray = documentIDs?.filter((e) => {
      return e.id !== (removedDocumentId?.id as string);
    });
    setDocumentIDs(newArray);
  }, [removedDocumentId]);

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
            items={documentIDs}
            isSidebarVisible={isSidebarVisible}
            onToggleSidebar={() => setIsSidebarVisible((v) => !v)}
            handleCloseTab={handleCloseTab}
          />
          <DocumentViewportArea></DocumentViewportArea>
        </>
      </TwoCol>
    </div>
  );
};

