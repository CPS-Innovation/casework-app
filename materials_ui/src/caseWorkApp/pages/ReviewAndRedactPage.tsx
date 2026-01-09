import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CaseworkPdfRedactorWrapper } from '../../../../materials_components/CaseworkPdfRedactorWrapper/CaseworkPdfRedactorWrapper';
import { DocumentControlArea } from '../../../../materials_components/documentControlArea';
import { DocumentSidebar } from '../../../../materials_components/DocumentSelectAccordion/DocumentSidebar';
import {
  TDocument,
  TDocumentList
} from '../../../../materials_components/DocumentSelectAccordion/getters/getDocumentList';
import { DocumentViewportArea } from '../../../../materials_components/documenViewportArea';
import { TMode } from '../../../../materials_components/PdfRedactor/utils/modeUtils';
import { useTrigger } from '../../../../materials_components/PdfRedactor/utils/useTriggger';
import {
  ButtonMenuComponent,
  Layout,
  RenameDrawer,
  TwoCol
} from '../../components';
import { useAppRoute, useCaseInfoStore } from '../../hooks';
import { GetDataFromAxios } from '../components/utils/getData';

export const ReviewAndRedactPage = () => {
  const { state: locationState } = useLocation();
  const { docType: docTypeParam } = locationState as { docType?: string };

  const { getRoute } = useAppRoute();
  const navigate = useNavigate();

  const { caseInfo } = useCaseInfoStore();
  const { id: caseId, urn } = caseInfo || {};
  const [activeDocumentId, setActiveDocumentId] = useState<string>();
  const [selectedDocumentForRename, setSelectedDocumentForRename] = useState<
    (TDocument & { materialId?: number }) | null
  >(null);

  // Temporary workaround: Helper to extract numeric documentId
  const getDocumentIdWithoutPrefix = (documentId: string) =>
    documentId.startsWith('CMS-') ? documentId.slice(4) : documentId;

  const [activeVersionId, setActiveVersionId] = useState<number | null>(null);

  const reloadTrigger = useTrigger();

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
        const activeDocument = item;

        setActiveDocumentId(activeDocument?.documentId);
        setActiveVersionId(activeDocument?.versionId);

        if (urn && caseId) {
          getPdfFiles({
            axiosInstance: axiosInstance,
            urn,
            caseId,
            documentId: activeDocument?.documentId,
            versionId: activeDocument?.versionId
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

  return (
    <Layout title="Review and Redact">
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
                reloadTriggerData={reloadTrigger.data}
                ActionComponent={(p: {
                  document: TDocument & { materialId?: number };
                }) => (
                  <ButtonMenuComponent
                    menuTitle="Actions"
                    menuItems={[
                      {
                        label: 'Rename',
                        onClick: () => {
                          const documentIdWithoutPrefix =
                            getDocumentIdWithoutPrefix(p.document.documentId);
                          setSelectedDocumentForRename({
                            ...p.document,
                            materialId: Number(documentIdWithoutPrefix)
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
                  mode={mode}
                ></DocumentViewportArea>
              </DocumentControlArea>

              {activeVersionId && activeDocumentId && urn && caseId && (
                <CaseworkPdfRedactorWrapper
                  fileUrl={pdfFileUrl}
                  mode={mode}
                  onModeChange={setMode}
                  onModification={() => reloadTrigger.fire()}
                  urn={urn}
                  caseId={caseId}
                  versionId={activeVersionId}
                  documentId={activeDocumentId}
                />
              )}
            </>
          )}
        </TwoCol>
      </div>
    </Layout>
  );
};
