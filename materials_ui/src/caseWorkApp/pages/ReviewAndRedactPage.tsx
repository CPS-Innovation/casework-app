import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ButtonMenuComponent,
  Layout,
  RenameDrawer,
  TwoCol
} from '../../components';
import { useAppRoute, useCaseInfoStore } from '../../hooks';
import { useOpenDocumentInNewWindow } from '../../hooks/ui/useOpenDocumentInNewWindow';
import { DocumentSidebar } from '../../materials_components/DocumentSelectAccordion/DocumentSidebar';
import { TDocument } from '../../materials_components/DocumentSelectAccordion/getters/getDocumentList';
import { DocumentTabPanel } from '../../materials_components/DocumentTabPanel/DocumentTabPanel';
import { TRedaction } from '../../materials_components/PdfRedactor/utils/coordUtils';
import { TMode } from '../../materials_components/PdfRedactor/utils/modeUtils';
import { useTrigger } from '../../materials_components/PdfRedactor/utils/useTriggger';
import { getDocumentIdWithoutPrefix } from '../../utils/string';
import { Button } from '../components/button';
import { Tabs } from '../components/tabs';
import { useStoreCWA } from '../store';

const ModalStyleTag = () => (
  <style>
    {`
    html, body {
      overflow: hidden !important;
    }
    `}
  </style>
);

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
  }, [p]);

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
          You have {documentsThatHaveRedactions.length} with unsaved redactions
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

  const { getRoute } = useAppRoute();
  const navigate = useNavigate();

  const { caseInfo } = useCaseInfoStore();
  const { id: caseId, urn } = caseInfo || {};
  const { handleTabSelection } = useStoreCWA();

  const [selectedDocumentForRename, setSelectedDocumentForRename] = useState<
    (TDocument & { materialId?: number }) | null
  >(null);

  const [redactionsIndexedOnDocId, setRedactionsIndexedOnDocId] = useState<{
    [k: string]: TRedaction[];
  }>({});

  const reloadSidebarTrigger = useTrigger();

  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [openDocumentIds, setOpenDocumentIds] = useState<string[]>([]);
  const [currentActiveTabId, setCurrentActiveTabId] = useState('');
  const [mode, setMode] = useState<TMode>('areaRedact');

  const { openPreview } = useOpenDocumentInNewWindow();

  const [showBlockNavigationModal, setShowBlockNavigationModal] =
    useState(false);
  const [attemptedNavigationHref, setAttemptedNavigationHref] =
    useState<string>();
  const [documents, setDocuments] = useState<TDocument[] | null | undefined>();

  // Handle docType param to open filtered documents
  useEffect(() => {
    if (docTypeParam && documents && documents.length > 0) {
      const filteredDocs = documents.filter(
        (doc) => doc.cmsDocType.documentType === docTypeParam
      );

      if (filteredDocs.length) {
        setCurrentActiveTabId(filteredDocs[0].documentId);
        setOpenDocumentIds((prev) => [
          ...prev,
          ...filteredDocs.map((doc) => doc.documentId)
        ]);
      }
    }
  }, [docTypeParam, documents]);

  const activeTabId =
    currentActiveTabId || openDocumentIds[openDocumentIds.length - 1] || '';

  const tabItems = useMemo(() => {
    if (!urn || !caseId) return [];

    return openDocumentIds
      .map((docId) => {
        const doc = documents?.find((d) => d.documentId === docId);
        if (!doc) return null;

        return {
          id: doc.documentId,
          label: doc.presentationTitle,
          versionId: doc.versionId,
          isDirty: (redactionsIndexedOnDocId[doc.documentId]?.length ?? 0) > 0,
          panel: {
            children: (
              <DocumentTabPanel
                key={doc.documentId}
                documentId={doc.documentId}
                versionId={doc.versionId}
                document={doc}
                urn={urn}
                caseId={caseId}
                mode={mode}
                onModeChange={setMode}
                onRedactionsChange={(redactions) => {
                  setRedactionsIndexedOnDocId((prev) => ({
                    ...prev,
                    [doc.documentId]: redactions
                  }));
                }}
                onModification={() => reloadSidebarTrigger.fire()}
                initRedactions={redactionsIndexedOnDocId[doc.documentId]}
                onViewInNewWindowClick={() => {
                  openPreview(
                    Number(getDocumentIdWithoutPrefix(doc.documentId))
                  );
                }}
              />
            )
          }
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);
  }, [
    openDocumentIds,
    documents,
    urn,
    caseId,
    mode,
    redactionsIndexedOnDocId,
    reloadSidebarTrigger,
    openPreview
  ]);

  const handleCloseTab = (id: string | undefined) => {
    setOpenDocumentIds((prev) => prev.filter((el) => el !== id));
    if (id === currentActiveTabId) {
      setCurrentActiveTabId('');
    }
  };

  const handleCurrentActiveTabId = (id?: string) => {
    setCurrentActiveTabId(id ?? '');
  };

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
            setCurrentActiveTabId(documentId);
            setShowBlockNavigationModal(false);
          }}
        />
      )}
      <div className="govuk-main-wrapper">
        {selectedDocumentForRename && (
          <RenameDrawer
            material={selectedDocumentForRename}
            onCancel={() => setSelectedDocumentForRename(null)}
            onSuccess={() => {
              setSelectedDocumentForRename(null);
              reloadSidebarTrigger.fire();
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
                onSetDocumentOpenIds={(docIds) => {
                  const newDocId = docIds.find(
                    (id) => !openDocumentIds.includes(id)
                  );
                  setOpenDocumentIds(docIds);
                  if (newDocId) {
                    handleTabSelection(newDocId);
                  }
                }}
                reloadTriggerData={reloadSidebarTrigger.data}
                ActionComponent={(p: {
                  document: TDocument & { materialId?: number };
                }) => (
                  <ButtonMenuComponent
                    menuTitle="Actions"
                    menuItems={[
                      {
                        label: 'Rename',
                        onClick: () => {
                          setSelectedDocumentForRename({
                            ...p.document,
                            materialId: Number(
                              getDocumentIdWithoutPrefix(p.document.documentId)
                            )
                          });
                        }
                      },
                      {
                        label: 'Discard',
                        onClick: () => {
                          navigate(getRoute('DISCARD'), {
                            state: {
                              selectedMaterial: p.document,
                              returnTo: getRoute('REVIEW_REDACT')
                            }
                          });
                        }
                      }
                    ]}
                  />
                )}
                onDocumentsChange={setDocuments}
              />
            ) : undefined
          }
        >
          {tabItems.length > 0 && (
            <>
              <Button onClick={() => setIsSidebarVisible((v) => !v)}>
                {isSidebarVisible ? 'Hide categories' : 'Show categories'}
              </Button>
              <Tabs
                idPrefix="tabs"
                title="Tabs title"
                items={tabItems}
                activeTabId={activeTabId}
                handleTabSelection={handleTabSelection}
                handleCurrentActiveTabId={handleCurrentActiveTabId}
                handleCloseTab={handleCloseTab}
                noMargin
              />
            </>
          )}
        </TwoCol>
      </div>
    </Layout>
  );
};
