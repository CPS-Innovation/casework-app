import { useEffect, useState } from 'react';
import { DocumentSidebarAccordionDocumentTemplate } from './DocumentSidebarAccordionDocument';
import {
  safeGetDocumentSidebarReadDocIdsFromLocalStorage,
  safeSetDocumentSidebarReadDocIdsFromLocalStorage
} from './DocumentSidebarLocalStorageUtils';
import { DocumentSidebarWrapper } from './DocumentSidebarWrapper';
import {
  categoryDetails,
  initDocsOnDocCategoryNamesMap
} from './getters/categoriseDocument';
import { categoriseDocument } from './getters/categoriseDocumentHelpers';
import { TDocumentList } from './getters/useGetCaseDocumentList';
import {
  GovUkAccordionOpenCloseLinkTemplate,
  GovUkAccordionSectionTemplate,
  GovUkAccordionTemplate
} from './templates/GovUkAccordion';
import { areSetsEqual } from './utils';

export const DocumentSidebarAccordion = (p: {
  caseId: number;
  documentList: TDocumentList;
  activeDocumentIds: string[];
  onNotesClick: (docId: string) => void;
  onSetActiveDocumentIds: (docIds: string[]) => void;
}) => {
  const { caseId } = p;

  const [activeDocumentIds, setActiveDocumentIds] = useState<string[]>(
    p.activeDocumentIds
  );

  const isNoChangeInActiveDocIds = () =>
    areSetsEqual(new Set(activeDocumentIds), new Set(p.activeDocumentIds));

  //handle two-way binding: parent to child
  useEffect(() => {
    if (!isNoChangeInActiveDocIds()) setActiveDocumentIds(p.activeDocumentIds);
  }, [p.activeDocumentIds]);
  //handle two-way binding: child to parent
  useEffect(() => {
    if (!isNoChangeInActiveDocIds())
      p.onSetActiveDocumentIds(activeDocumentIds);
  }, [activeDocumentIds]);

  const [isExpandedController, setIsExpandedController] = useState(false);
  const [readDocumentIds, setReadDocumentIds] = useState<string[]>(
    safeGetDocumentSidebarReadDocIdsFromLocalStorage(p.caseId)
  );

  useEffect(() => {
    const newReadDocIds = [
      ...new Set([...readDocumentIds, ...p.activeDocumentIds])
    ];
    safeSetDocumentSidebarReadDocIdsFromLocalStorage({ caseId, newReadDocIds });
  }, [readDocumentIds]);

  const docsOnDocCategoryNames = initDocsOnDocCategoryNamesMap();
  p.documentList.forEach((doc) => {
    const categoryName = categoriseDocument(doc);
    docsOnDocCategoryNames[categoryName].push(doc);
  });
  const newData = categoryDetails.map((x) => ({
    key: x.label,
    label: x.label,
    documents: docsOnDocCategoryNames[x.categoryName]
  }));

  return (
    <div>
      <GovUkAccordionOpenCloseLinkTemplate
        isExpandedController={isExpandedController}
        onClick={() => setIsExpandedController((x) => !x)}
      />
      <DocumentSidebarWrapper>
        <GovUkAccordionTemplate>
          {newData.map((item) => (
            <GovUkAccordionSectionTemplate
              key={item.key}
              title={`${item.label} (${item.documents.length})`}
              isExpandedController={isExpandedController}
            >
              {item.documents.length === 0 ? (
                <div style={{ height: '60px', padding: '12px' }}>
                  There are no documents available.
                </div>
              ) : (
                item.documents.map((document) => (
                  <DocumentSidebarAccordionDocumentTemplate
                    key={`${item.key}-${document.documentId}`}
                    documentName={document.presentationTitle}
                    documentDate={document.documentId}
                    ActiveDocumentTag={activeDocumentIds.includes(
                      document.documentId
                    )}
                    NewTag={!readDocumentIds.includes(document.documentId)}
                    showLeftBorder={activeDocumentIds.includes(
                      document.documentId
                    )}
                    notesStatus={(() => {
                      if (
                        document.cmsDocType.documentType === 'PCD' ||
                        document.cmsDocType.documentCategory === 'Review'
                      )
                        return 'disabled';
                      return document.hasNotes ? 'newNotes' : 'none';
                    })()}
                    onDocumentClick={() => {
                      setReadDocumentIds((docIds) => [
                        ...new Set([...docIds, document.documentId])
                      ]);
                      const docSet = new Set([
                        ...activeDocumentIds,
                        document.documentId
                      ]);
                      setActiveDocumentIds([...docSet]);
                    }}
                    onNotesClick={() => p.onNotesClick(document.documentId)}
                  />
                ))
              )}
            </GovUkAccordionSectionTemplate>
          ))}
        </GovUkAccordionTemplate>
      </DocumentSidebarWrapper>

      {/* <pre>{JSON.stringify(p.documentList, null, 2)}</pre> */}
    </div>
  );
};
