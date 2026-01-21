import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, RenameDrawer, TwoCol } from '../../components';
import { useCaseInfoStore } from '../../hooks';
import { useOpenDocumentInNewWindow } from '../../hooks/ui/useOpenDocumentInNewWindow';
import { CaseworkPdfRedactorWrapper } from '../../materials_components/CaseworkPdfRedactorWrapper/CaseworkPdfRedactorWrapper';
import { DocumentControlArea } from '../../materials_components/documentControlArea';
import { DocumentSidebar } from '../../materials_components/DocumentSelectAccordion/DocumentSidebar';
import {
  TDocument,
  TDocumentList
} from '../../materials_components/DocumentSelectAccordion/getters/getDocumentList';
import { DocumentViewportArea } from '../../materials_components/documenViewportArea';
import { TRedaction } from '../../materials_components/PdfRedactor/utils/coordUtils';
import { TMode } from '../../materials_components/PdfRedactor/utils/modeUtils';
import { useTrigger } from '../../materials_components/PdfRedactor/utils/useTriggger';
import { getDocumentIdWithoutPrefix } from '../../utils/string';
import { Button } from '../components/button';
import { GetDataFromAxios } from '../components/utils/getData';

const ModalStyleTag = () => {
  return (
    <style>
      {`
      html, body {
        overflow: hidden !important;
      }
      `}
    </style>
  );
};
export const Modal = (p: {
  children: React.ReactNode;
  onBackgroundClick: () => void;
  onEscPress: () => void;
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.code === 'Escape') p.onBackgroundClick();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  return (
    <>
      <ModalStyleTag />
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#00000080',
          zIndex: 999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onClick={p.onBackgroundClick}
      >
        <div
          ref={popupRef}
          style={{
            position: 'relative',
            borderRadius: '8px',
            boxShadow: '0 0 5px 5px #0003',
            zIndex: 1000,
            filter: 'drop-shadow(0 1px 2.5px #000)',
            overflow: 'hidden'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {p.children}
        </div>
      </div>
    </>
  );
};

const UnsavedRedactionsModal = (p: {
  redactionsIndexedOnDocumentId: { [k: string]: TRedaction[] };
  documents: TDocument[];
  onReturnClick: () => void;
  onIgnoreClick: () => void;
  onDocumentClick: (documentId: string) => void;
}) => {
  const redactionDocumentIds = Object.keys(p.redactionsIndexedOnDocumentId);
  const documentsThatHaveRedactions = p.documents.filter((doc) =>
    redactionDocumentIds.includes(doc.documentId)
  );

  return (
    <Modal onBackgroundClick={p.onIgnoreClick} onEscPress={p.onIgnoreClick}>
      <div style={{ padding: '20px', background: 'white' }}>
        <div>
          You have {documentsThatHaveRedactions.length} documents with unsaved
          redactions
        </div>
        <br />
        <div style={{ display: 'flex', gap: '4px', flexDirection: 'column' }}>
          {documentsThatHaveRedactions.map((doc) => (
            <a
              className="govuk-link"
              key={doc.documentId}
              onClick={() => p.onDocumentClick(doc.documentId)}
            >
              {doc.presentationTitle}
            </a>
          ))}
        </div>
        <br />
        <div>
          If you do not save the redactions the file will not be changed.
        </div>
        <br />
        <div style={{ display: 'flex', gap: '16px' }}>
          <Button variant="primary" onClick={p.onReturnClick}>
            Return to case file
          </Button>
          <Button variant="inverse" onClick={p.onIgnoreClick}>
            Ignore
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export const ReviewAndRedactPage = () => {
  const { state: locationState } = useLocation();
  const { docType: docTypeParam } = locationState as { docType?: string };

  const navigate = useNavigate();

  const { caseInfo } = useCaseInfoStore();
  const { id: caseId, urn } = caseInfo || {};
  const [activeDocumentId, setActiveDocumentId] = useState<string>();
  const [selectedDocumentForRename, setSelectedDocumentForRename] = useState<
    (TDocument & { materialId?: number }) | null
  >(null);

  const [activeVersionId, setActiveVersionId] = useState<number | null>(null);
  const [activeDocument, setActiveDocument] = useState<TDocument | null>(null);

  const [redactionsIndexedOnDocId, setRedactionsIndexedOnDocId] = useState<{
    [k: string]: TRedaction[];
  }>({});

  const reloadSidebarTrigger = useTrigger();

  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const [documentIDs, setDocumentIDs] = useState<any[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');

  const [openDocumentIds, setOpenDocumentIds] = useState<string[]>([]);
  const [currentActiveTabId, setCurrentActiveTabId] = useState<string>('');
  const [mode, setMode] = useState<TMode>('areaRedact');
  const [pdfFileUrl, setPdfFileUrl] = useState<string>('');

  const handleCloseTab = (v: string | undefined) => {
    setOpenDocumentIds((prev) => prev.filter((el) => el !== v));
  };
  const handleCurrentActiveTabId = (x?: string) => {
    setCurrentActiveTabId(x ? x : '');
  };
  const [documentsDataList, setDocumentsDataList] = useState<TDocumentList>([]);
  const { useAxiosInstance, getDocuments, getPdfFiles } = GetDataFromAxios();

  const { openPreview } = useOpenDocumentInNewWindow();

  const axiosInstance = useAxiosInstance();

  useEffect(() => {
    if (urn && caseId) {
      getDocuments({ axiosInstance: axiosInstance, urn, caseId }).then(
        (data) => {
          setDocumentsDataList(data);
        }
      );
    }
  }, [caseId, urn]);

  useEffect(() => {
    const matchingDocuments = documentsDataList.filter((item) => {
      return openDocumentIds.includes(item.documentId);
    });

    const sortedMatchingDocuments = matchingDocuments.sort(
      (a, b) =>
        openDocumentIds.indexOf(a.documentId) -
        openDocumentIds.indexOf(b.documentId)
    );

    const matchingResult = sortedMatchingDocuments?.map((item) => {
      return {
        id: item.documentId,
        label: item.presentationTitle,
        title: item.presentationTitle,
        versionId: item.versionId
      };
    });

    setDocumentIDs(matchingResult);

    const targetDocumentId =
      currentActiveTabId !== ''
        ? currentActiveTabId
        : openDocumentIds[openDocumentIds.length - 1];

    documentsDataList?.forEach((item) => {
      if (item.documentId === targetDocumentId) {
        setActiveDocument(item);
        setActiveDocumentId(item?.documentId);
        setActiveVersionId(item?.versionId);

        if (urn && caseId) {
          getPdfFiles({
            axiosInstance: axiosInstance,
            urn,
            caseId,
            documentId: item?.documentId,
            versionId: item?.versionId
          }).then((blob) => {
            if (blob instanceof Blob) {
              const blobResponse = window.URL.createObjectURL(blob);
              setPdfFileUrl(blobResponse);
            }
          });
        }
      }
    });
  }, [openDocumentIds, currentActiveTabId, caseId, urn]);

  useEffect(() => {
    const lastId =
      openDocumentIds.length > 0
        ? openDocumentIds[openDocumentIds.length - 1]
        : '';
    setActiveTabId(lastId);
  }, [openDocumentIds]);

  useEffect(() => {
    if (docTypeParam) {
      const filteredDocs = documentsDataList.filter(
        (doc) => doc.cmsDocType.documentType === docTypeParam
      );

      if (filteredDocs.length) {
        setCurrentActiveTabId(filteredDocs[0].documentId);
        setOpenDocumentIds((prevState) => [
          ...prevState,
          ...filteredDocs.map((doc) => doc.documentId)
        ]);
      }
    }
  }, [locationState, docTypeParam, documentsDataList]);

  const [showBlockNavigationModal, setShowBlockNavigationModal] =
    useState(false);
  const [attemptedNavigationHref, setAttemptedNavigationHref] =
    useState<string>();

  const [documents, setDocuments] = useState<TDocument[] | null | undefined>();
  const docIds = documentIDs.map((doc) => getDocumentIdWithoutPrefix(doc.id));

  return (
    <Layout
      title="Review and Redact"
      shouldBlockNavigationCheck={(tab) => {
        const shouldBlock = Object.values(redactionsIndexedOnDocId).some(
          (redacts) => redacts.length > 0
        );
        if (!shouldBlock) return false;

        setShowBlockNavigationModal(true);
        setAttemptedNavigationHref(tab.href);
        return true;
      }}
    >
      {showBlockNavigationModal && (
        <UnsavedRedactionsModal
          redactionsIndexedOnDocumentId={redactionsIndexedOnDocId}
          onIgnoreClick={() => {
            if (attemptedNavigationHref) navigate(attemptedNavigationHref);
          }}
          onReturnClick={() => setShowBlockNavigationModal(false)}
          documents={documents ?? []}
          onDocumentClick={(documentId) => {
            setActiveDocumentId(documentId);
            setShowBlockNavigationModal(false);
          }}
        />
      )}
      <div className="govuk-main-wrapper">
        {selectedDocumentForRename && (
          <RenameDrawer
            material={selectedDocumentForRename}
            onCancel={() => setSelectedDocumentForRename(null)}
            onSuccess={async () => {
              setSelectedDocumentForRename(null);
              if (urn && caseId) {
                const data = await getDocuments({ axiosInstance, urn, caseId });
                setDocumentsDataList(data);
              }
            }}
          />
        )}

        <TwoCol
          sidebar={
            isSidebarVisible && caseId && urn ? (
              <DocumentSidebar
                urn={urn}
                caseId={caseId}
                openDocumentIds={openDocumentIds}
                onSetDocumentOpenIds={(docIds) => setOpenDocumentIds(docIds)}
                reloadTriggerData={reloadSidebarTrigger.data}
                // ActionComponent={(p: {
                //   document: TDocument & { materialId?: number };
                // }) => (
                //   <ButtonMenuComponent
                //     menuTitle="Actions"
                //     menuItems={[
                //       {
                //         label: 'Rename',
                //         onClick: () => {
                //           const documentIdWithoutPrefix =
                //             getDocumentIdWithoutPrefix(p.document.documentId);
                //           setSelectedDocumentForRename({
                //             ...p.document,
                //             materialId: Number(documentIdWithoutPrefix)
                //           });
                //         }
                //       },
                //       {
                //         label: 'Discard',
                //         onClick: () => {
                //           navigate(getRoute('DISCARD'), {
                //             state: {
                //               selectedMaterial: p.document,
                //               returnTo: getRoute('REVIEW_REDACT')
                //             }
                //           });
                //         }
                //       }
                //     ]}
                //   />
                // )}
                onDocumentsChange={(documents) => setDocuments(documents)}
              />
            ) : undefined
          }
        >
          {documentIDs.length > 0 && (
            <>
              <DocumentControlArea
                activeTabId={activeTabId}
                items={documentIDs || []}
                isSidebarVisible={isSidebarVisible}
                onToggleSidebar={() => setIsSidebarVisible((v) => !v)}
                handleCloseTab={(a) => handleCloseTab(a)}
                handleCurrentActiveTabId={handleCurrentActiveTabId}
              >
                <DocumentViewportArea
                  activeTabId={activeTabId}
                  items={documentIDs}
                  redactAreaState={mode === 'areaRedact'}
                  currentActiveTabId={currentActiveTabId}
                  onRedactAreaStateChange={(x) => {
                    setMode(x ? 'areaRedact' : 'textRedact');
                  }}
                  onRotateModeButtonClick={() => {
                    setMode((prev) =>
                      prev === 'rotation' ? 'areaRedact' : 'rotation'
                    );
                  }}
                  onDeleteModeButtonClick={() => {
                    setMode((prev) =>
                      prev === 'deletion' ? 'areaRedact' : 'deletion'
                    );
                  }}
                  onViewInNewWindowButtonClick={async () => {
                    openPreview(Number(docIds));
                  }}
                  mode={mode}
                ></DocumentViewportArea>
              </DocumentControlArea>

              {activeDocument &&
                activeVersionId &&
                activeDocumentId &&
                urn &&
                caseId && (
                  <CaseworkPdfRedactorWrapper
                    key={`${pdfFileUrl}-${activeDocumentId}-${activeVersionId}`}
                    fileUrl={pdfFileUrl}
                    mode={mode}
                    onModeChange={setMode}
                    onModification={() => reloadSidebarTrigger.fire()}
                    urn={urn}
                    caseId={caseId}
                    versionId={activeVersionId}
                    documentId={activeDocumentId}
                    document={activeDocument}
                    onRedactionsChange={(redactions) => {
                      setRedactionsIndexedOnDocId((prev) => ({
                        ...prev,
                        [activeDocument.documentId]: redactions
                      }));
                    }}
                    initRedactions={
                      redactionsIndexedOnDocId[activeDocument.documentId] ?? []
                    }
                  />
                )}
            </>
          )}
        </TwoCol>
      </div>
    </Layout>
  );
};
