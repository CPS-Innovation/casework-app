import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Layout, RenameDrawer, TwoCol } from '../../../components';
import { useCaseInfoStore } from '../../../hooks';
import { useOpenDocumentInNewWindow } from '../../../hooks/ui/useOpenDocumentInNewWindow';
import { DocumentSidebar } from '../../../materials_components/DocumentSelectAccordion/DocumentSidebar';
import { TDocument } from '../../../materials_components/DocumentSelectAccordion/getters/getDocumentList';
import { DocumentTabPanel } from '../../../materials_components/DocumentTabPanel/DocumentTabPanel';
import { TRedaction } from '../../../materials_components/PdfRedactor/utils/coordUtils';
import { TMode } from '../../../materials_components/PdfRedactor/utils/modeUtils';
import { useTrigger } from '../../../materials_components/PdfRedactor/utils/useTriggger';
import { getDocumentIdWithoutPrefix } from '../../../utils/string';
import { Button } from '../../components/button';
import { Tabs } from '../../components/tabs';
import { useStoreCWA } from '../../store';
import { UnsavedRedactionsModal } from './UnsavedRedactionsModal';

export const ReviewAndRedactPage = () => {
  const { state: locationState } = useLocation();
  const { docType: docTypeParam } = locationState as { docType?: string };

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
        />
      )
    }
  }));

  const handleCloseTab = (id: string | undefined) => {
    if (id === currentActiveTabId) {
      const index = openDocumentIds.indexOf(id);
      const nextTab =
        openDocumentIds[index + 1] ?? openDocumentIds[index - 1] ?? '';
      setCurrentActiveTabId(nextTab);
    }
    setOpenDocumentIds((prev) => prev.filter((el) => el !== id));
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
                activeDocumentId={activeTabId}
                openDocumentIds={openDocumentIds}
                onSetDocumentOpenIds={setOpenDocumentIds}
                onDocumentClick={handleTabSelection}
                reloadTriggerData={reloadSidebarTrigger.data}
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
