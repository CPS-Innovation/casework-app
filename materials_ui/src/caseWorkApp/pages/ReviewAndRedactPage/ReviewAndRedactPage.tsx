import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DocumentKeywordSearch,
  Layout,
  LoadingSpinner,
  RenameDrawer,
  TwoCol
} from '../../../components';
import { useCaseInfoStore } from '../../../hooks';
import { useOpenDocumentInNewWindow } from '../../../hooks/ui/useOpenDocumentInNewWindow';
import { DocumentSidebar } from '../../../materials_components/DocumentSelectAccordion/DocumentSidebar';
import { TDocument } from '../../../materials_components/DocumentSelectAccordion/getters/getDocumentList';
import {
  clearOpenDocumentTabsFromLocalStorage,
  safeGetOpenDocumentTabsFromLocalStorage,
  safeSetOpenDocumentTabsFromLocalStorage
} from '../../../materials_components/DocumentSelectAccordion/utils/OpenDocumentTabsLocalStorageUtils';
import { DocumentTabPanel } from '../../../materials_components/DocumentTabPanel/DocumentTabPanel';
import { TRedaction } from '../../../materials_components/PdfRedactor/utils/coordUtils';
import { TMode } from '../../../materials_components/PdfRedactor/utils/modeUtils';
import { useTrigger } from '../../../materials_components/PdfRedactor/utils/useTriggger';
import { RedactionLogModal } from '../../../materials_components/RedactionLog/RedactionLogModal';
import { getDocumentIdWithoutPrefix } from '../../../utils/string';
import { Tabs } from '../../components/tabs';
import { getLookups, useAxiosInstance } from '../../components/utils/getData';
import { TLookupsResponse } from '../../types/redaction';
import { UnsavedRedactionsModal } from './UnsavedRedactionsModal';

export const ReviewAndRedactPage = () => {
  const { state: locationState } = useLocation();
  const { docType: docTypeParam, materialId: materialIdParam } = (locationState || {}) as {
    docType?: string;
    materialId?: string;
  };

  const navigate = useNavigate();

  const { caseInfo } = useCaseInfoStore();
  const { id: caseId, urn } = caseInfo || {};

  const [selectedDocumentForRename, setSelectedDocumentForRename] = useState<
    (TDocument & { materialId?: number }) | null
  >(null);

  const [redactionsIndexedOnDocId, setRedactionsIndexedOnDocId] = useState<{
    [k: string]: TRedaction[];
  }>({});

  const reloadSidebarTrigger = useTrigger();

  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [openDocumentIds, setOpenDocumentIds] = useState<string[]>([]);
  const [activeDocumentId, setActiveDocumentId] = useState('');
  const [mode, setMode] = useState<TMode>('textRedact');

  const { openPreview } = useOpenDocumentInNewWindow();

  const [showBlockNavigationModal, setShowBlockNavigationModal] =
    useState(false);
  const [attemptedNavigationHref, setAttemptedNavigationHref] =
    useState<string>();
  const [documents, setDocuments] = useState<TDocument[] | null | undefined>();

  const [showRedactionLogModal, setShowRedactionLogModal] = useState(false);
  const [lookups, setLookups] = useState<TLookupsResponse>();

  const axiosInstance = useAxiosInstance();

  useEffect(() => {
    if (!caseId) return;
    const saved = safeGetOpenDocumentTabsFromLocalStorage(caseId);
    if (saved && saved.openDocumentIds.length > 0) {
      setOpenDocumentIds(saved.openDocumentIds);
      setActiveDocumentId(saved.activeDocumentId);
    }
  }, [caseId]);

  useEffect(() => {
    if (!caseId) return;
    if (openDocumentIds.length === 0) {
      clearOpenDocumentTabsFromLocalStorage(caseId);
    } else {
      safeSetOpenDocumentTabsFromLocalStorage({
        caseId,
        openDocumentIds,
        activeDocumentId
      });
    }
  }, [caseId, openDocumentIds, activeDocumentId]);

  useEffect(() => {
    if (materialIdParam) {
      setActiveDocumentId(materialIdParam);
      setOpenDocumentIds((openedDocumentIds) => [...openedDocumentIds, `${materialIdParam}`]);
    }
  }, [materialIdParam]);

  useEffect(() => {
    if (docTypeParam && documents && documents.length > 0) {
      const filteredDocs = documents.filter(
        (doc) => doc.cmsDocType.documentType === docTypeParam
      );

      if (filteredDocs.length) {
        setActiveDocumentId(filteredDocs[0].documentId);
        setOpenDocumentIds((prev) => [
          ...prev,
          ...filteredDocs.map((doc) => doc.documentId)
        ]);
      }
    }
  }, [docTypeParam, documents]);

  const openDocuments =
    urn && caseId
      ? openDocumentIds
          .map((docId) => documents?.find((d) => d.documentId === docId))
          .filter((doc): doc is TDocument => doc !== undefined)
      : [];

  const tabItems = openDocuments.map((doc) => ({
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
          urn={urn!}
          caseId={caseId!}
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
            openPreview(Number(getDocumentIdWithoutPrefix(doc.documentId)));
          }}
          onRedactionLogClick={() => setShowRedactionLogModal(true)}
        />
      )
    }
  }));

  const handleCloseTab = (documentId: string | undefined) => {
    if (documentId && documentId === activeDocumentId) {
      const index = openDocumentIds.indexOf(documentId);
      const nextDocumentId =
        openDocumentIds[index + 1] ?? openDocumentIds[index - 1] ?? '';
      setActiveDocumentId(nextDocumentId);
    }
    setOpenDocumentIds((prev) => prev.filter((id) => id !== documentId));
  };

  const activeTabId = activeDocumentId || openDocumentIds[0] || '';

  const activeDocument = openDocuments.find(
    (doc) => doc.documentId === activeTabId
  );

  useEffect(() => {
    if (showRedactionLogModal) {
      getLookups({ axiosInstance: axiosInstance }).then((data) => {
        setLookups(data);
      });
    }
  }, [showRedactionLogModal]);

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
      {documents === undefined && (
        <LoadingSpinner textContent="Loading documents" />
      )}
      {documents === null && <div>Error...</div>}
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
            onSuccess={() => {
              setSelectedDocumentForRename(null);
              reloadSidebarTrigger.fire();
            }}
          />
        )}

        {showRedactionLogModal && (
          <RedactionLogModal
            urn={urn!}
            caseId={caseId!}
            isOpen={showRedactionLogModal}
            onClose={() => setShowRedactionLogModal(false)}
            lookups={lookups}
            activeDocument={activeDocument}
            mode="over-under"
          />
        )}

        <TwoCol
          sidebar={
            isSidebarVisible && caseId && urn ? (
              <>
                {documents && <DocumentKeywordSearch />}
                <DocumentSidebar
                  urn={urn}
                  caseId={caseId}
                  activeDocumentId={activeTabId}
                  openDocumentIds={openDocumentIds}
                  onSetDocumentOpenIds={setOpenDocumentIds}
                  onDocumentClick={setActiveDocumentId}
                  reloadTriggerData={reloadSidebarTrigger.data}
                  onDocumentsChange={setDocuments}
                />
              </>
            ) : undefined
          }
        >
          {tabItems.length > 0 && (
            <>
              <Tabs
                items={tabItems}
                activeTabId={activeDocumentId}
                handleTabSelection={setActiveDocumentId}
                handleCloseTab={handleCloseTab}
                noMargin
                onShowHideCategoriesClick={() => setIsSidebarVisible((v) => !v)}
                isShowCategories={isSidebarVisible}
              />
            </>
          )}
        </TwoCol>
      </div>
    </Layout>
  );
};
