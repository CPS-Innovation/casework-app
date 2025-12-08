import { useEffect, useState } from 'react';
import { Layout, TwoCol } from '../../components';
import { CaseworkPdfRedactorWrapper } from '../../packages/CaseworkPdfRedactorWrapper/CaseworkPdfRedactorWrapper';
import { DocumentSidebar } from '../../packages/DocumentSelectAccordion/DocumentSidebar';
import { TMode } from '../../packages/PdfRedactor/utils/modeUtils';
import { DocumentControlArea } from '../components/documentControlArea';
import { DocumentViewportArea } from '../components/documenViewportArea';
import { GetDataFromAxios } from '../components/utils.ts/getData';

type TDocumentDataList = {
  id: string;
  cmsOriginalFileName: string;
  documentId: string;
  hasNotes: boolean;
  isUnused: boolean;
  presentationTitle: string;
  status: string;
};

export const ReviewAndRedactPage = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const [documentIDs, setDocumentIDs] = useState<any[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');

  const [openDocumentIds, setOpenDocumentIds] = useState<string[]>([]);
  const [currentActiveTabId, setCurrentActiveTabId] = useState<string>('');
  const [mode, setMode] = useState<TMode>('areaRedact');

  const handleCloseTab = (v: string | undefined) => {
    setOpenDocumentIds((prev) => prev.filter((el) => el !== v));
  };
  const handleCurentActiveTabId = (x?: string) => {
    setCurrentActiveTabId(x ? x : '');
  };
  const [documentsDataList, setDocumentsDataList] = useState<
    TDocumentDataList[]
  >([]);
  const { useAxiosInstance, getDocuments } = GetDataFromAxios();

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
        title: item.presentationTitle
      };
    });

    setDocumentIDs(matchingResult);
  }, [openDocumentIds]);

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
              />
            ) : undefined
          }
        >
          <DocumentControlArea
            activeTabId={activeTabId}
            items={documentIDs}
            isSidebarVisible={isSidebarVisible}
            onToggleSidebar={() => setIsSidebarVisible((v) => !v)}
            handleCloseTab={(a) => handleCloseTab(a)}
            handleCurentActiveTabId={handleCurentActiveTabId}
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
            ></DocumentViewportArea>
          </DocumentControlArea>

          <CaseworkPdfRedactorWrapper
            // fileUrls left purposefully
            // fileUrl="http://localhost:3000/test-pdfs/may-plus-images.pdf"
            // fileUrl="http://localhost:3000/test-pdfs/final.pdf"

            fileUrl="http://localhost:3000/test-pdfs/final-with-https.pdf"
            mode={mode}
            onModeChange={setMode}
          />
        </TwoCol>
      </div>
    </Layout>
  );
};
