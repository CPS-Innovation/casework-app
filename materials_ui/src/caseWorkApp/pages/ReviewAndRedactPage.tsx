import { useEffect, useState } from 'react';
import { CaseworkPdfRedactorWrapper } from '../../../../materials_components/CaseworkPdfRedactorWrapper/CaseworkPdfRedactorWrapper';
import { DocumentSidebar } from '../../../../materials_components/DocumentSelectAccordion/DocumentSidebar';
import { TMode } from '../../../../materials_components/PdfRedactor/utils/modeUtils';
import { useTrigger } from '../../../../materials_components/PdfRedactor/utils/useTriggger';
import { Layout, TwoCol } from '../../components';
import { DocumentControlArea } from '../components/documentControlArea';
import { DocumentViewportArea } from '../components/documenViewportArea';
import { GetDataFromAxios } from '../components/utils/getData';

type TDocumentDataList = {
  id: string;
  cmsOriginalFileName: string;
  documentId: string;
  hasNotes: boolean;
  isUnused: boolean;
  versionId: number;
  presentationTitle: string;
  status: string;
};

export const ReviewAndRedactPage = () => {
  const urn = '54KR7689125'; // TODO - make it dynamic
  const caseId = 2160797; // TODO - make it dynamic
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
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
  const [documentsDataList, setDocumentsDataList] = useState<
    TDocumentDataList[]
  >([]);
  const { useAxiosInstance, getDocuments, getPdfFiles } = GetDataFromAxios();

  const axiosInstance = useAxiosInstance();

  useEffect(() => {
    getDocuments({
      axiosInstance: axiosInstance,
      urn: '54KR7689125',
      caseId: 2160797
    }).then((data) => {
      setDocumentsDataList(data);
    });
  }, []);

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

    let targetDocumentId =
      currentActiveTabId !== ''
        ? currentActiveTabId
        : openDocumentIds[openDocumentIds.length - 1];

    documentsDataList?.forEach((item) => {
      if (item.documentId === targetDocumentId) {
        const activeDocument = item;

        setActiveDocumentId(activeDocument?.documentId);
        setActiveVersionId(activeDocument?.versionId);

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
    });
  }, [openDocumentIds, currentActiveTabId]);

  useEffect(() => {
    const lastId =
      openDocumentIds.length > 0
        ? openDocumentIds[openDocumentIds.length - 1]
        : '';
    setActiveTabId(lastId);
  }, [openDocumentIds]);

  return (
    <Layout title="Review and Redact">
      <div className="govuk-main-wrapper">
        <TwoCol
          sidebar={
            isSidebarVisible ? (
              <DocumentSidebar
                urn="54KR7689125"
                caseId={2160797}
                openDocumentIds={openDocumentIds}
                onSetDocumentOpenIds={(docIds) => setOpenDocumentIds(docIds)}
                reloadTriggerData={reloadTrigger.data}
              />
            ) : undefined
          }
        >
          {documentIDs.length > 0 && (
            <>
              <DocumentControlArea
                activeTabId={activeTabId}
                items={documentIDs}
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

              {activeVersionId && activeDocumentId && (
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
