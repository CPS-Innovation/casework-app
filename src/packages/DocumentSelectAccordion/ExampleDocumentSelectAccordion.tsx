import { useEffect, useState } from 'react';
import z from 'zod';
import { DocumentSelectAccordionDocumentTemplate } from './DocumentSelectAccordionDocument';
import {
  categoryDetails,
  initDocsOnDocCategoryNamesMap
} from './getters/categoriseDocument';
import { getDocumentCategory } from './getters/categoriseDocumentHelpers';
import {
  documentListSchema,
  TDocumentList,
  useGetCaseDocumentList
} from './getters/useGetCaseDocumentList';
import {
  GovUkAccordionSectionTemplate,
  GovUkAccordionTemplate
} from './templates/GovUkAccordion';

const safeJsonParse = (x: unknown) => {
  try {
    return { success: true, data: JSON.parse(x as string) } as const;
  } catch (error) {
    return { success: false, error: {} } as const;
  }
};

const safeGetReadCaseDocumentIdsFromLocalStorage = (caseId: number) => {
  const localStorageKey = `caseDocumentAccordionReadDocIds-${caseId}`;
  const schema = z.array(z.string());
  const readDocsJson = window.localStorage.getItem(localStorageKey) ?? '[]';
  const readDocsJsonParsed = safeJsonParse(readDocsJson);
  const readDocsSchemaParsed = schema.safeParse(readDocsJsonParsed.data);

  return readDocsSchemaParsed.success ? readDocsSchemaParsed.data : [];
};
const safeSetReadCaseDocumentsFromLocalStorage = (p: {
  caseId: number;
  newReadDocIds: string[];
}) => {
  const localStorageKey = `caseDocumentAccordionReadDocIds-${p.caseId}`;

  window.localStorage.setItem(localStorageKey, JSON.stringify(p.newReadDocIds));
};

export const DocumentSidebar = (p: {
  urn: string;
  caseId: number;
  openDocumentIds: string[];
  onSetDocumentOpenIds: (docIds: string[]) => void;
}) => {
  const { caseId, urn } = p;
  const documentList = useGetCaseDocumentList({ urn, caseId });
  const [mode, setMode] = useState<
    { mode: 'accordion' } | { mode: 'notes'; documentId: string }
  >({ mode: 'accordion' });

  const parsed = documentListSchema.safeParse(documentList.data);

  if (!parsed.success) return <></>;

  if (mode.mode === 'accordion')
    return (
      <div>
        <DocumentSelectAccordion
          caseId={caseId}
          documentList={documentList.data}
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
      <>
        <button
          onClick={() => {
            setMode({ mode: 'accordion' });
          }}
        >
          go back
        </button>
        {documentId}
      </>
    );
  }
};

const DocumentSelectAccordion = (p: {
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

  const isNoChangeInActiveDocIds = () => {
    const set1 = new Set(activeDocumentIds);
    const set2 = new Set(p.activeDocumentIds);
    if (set1.size !== set2.size) return false;
    return [...set1].every((item) => set2.has(item));
  };

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
    safeGetReadCaseDocumentIdsFromLocalStorage(p.caseId)
  );

  useEffect(() => {
    const newReadDocIds = [
      ...new Set([...readDocumentIds, ...p.activeDocumentIds])
    ];
    safeSetReadCaseDocumentsFromLocalStorage({ caseId, newReadDocIds });
  }, [readDocumentIds]);

  const docsOnDocCategoryNames = initDocsOnDocCategoryNamesMap();
  p.documentList.forEach((doc) => {
    const categoryName = getDocumentCategory(doc);
    docsOnDocCategoryNames[categoryName].push(doc);
  });
  const newData = categoryDetails.map((x) => ({
    key: x.label,
    label: x.label,
    documents: docsOnDocCategoryNames[x.categoryName]
  }));

  return (
    <div>
      <a
        className="govuk-link"
        onClick={() => setIsExpandedController((x) => !x)}
        style={{ float: 'right', paddingBottom: '8px', cursor: 'pointer' }}
      >
        {isExpandedController ? 'Close' : 'Open'} all sections
      </a>
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
                <DocumentSelectAccordionDocumentTemplate
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

      <pre>{JSON.stringify(p.documentList, null, 2)}</pre>
    </div>
  );
};
