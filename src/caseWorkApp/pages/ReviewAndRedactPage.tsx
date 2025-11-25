import { ComponentProps, useEffect, useRef, useState } from 'react';
import { Layout, TwoCol } from '../../components';
import { DocumentSidebar } from '../../packages/DocumentSelectAccordion/DocumentSidebar';
import { RedactionDetailsForm } from '../../packages/PdfRedactor/PdfRedactionTypeForm';
import { PdfRedactor } from '../../packages/PdfRedactor/PdfRedactor';
import {
  PdfRedactorMiniModal,
  useWindowMouseListener
} from '../../packages/PdfRedactor/PdfRedactorMiniModal';
import {
  TCoord,
  TRedaction
} from '../../packages/PdfRedactor/utils/coordUtils';
import { TMode } from '../../packages/PdfRedactor/utils/modeUtils';
import { DocumentControlArea } from '../components/documentControlArea';
import { DocumentViewportArea } from '../components/documenViewportArea';
import { GetDataFromAxios } from '../components/utils/getData';

type TDocumentDataList = {
  id: string;
  cmsOriginalFileName: string;
  documentId: string;
  hasNotes: boolean;
  isUnused: boolean;
  presentationTitle: string;
  status: string;
};

const CaseworkPdfRedactor = (p: {
  fileUrl: string;
  mode: TMode;
  onModeChange: (x: TMode) => void;
}) => {
  const [redactions, setRedactions] = useState<TRedaction[]>([]);

  const [redactionDetails, setRedactionDetails] = useState<
    { redactionId: string; randomId: string }[]
  >([]);

  useEffect(() => {
    const redactionIds = redactions.map((red) => red.id);
    setRedactionDetails((prev) =>
      prev.filter((redDetail) => redactionIds.includes(redDetail.redactionId))
    );
  }, [redactions]);

  const [popupProps, setPopupProps] = useState<Omit<
    ComponentProps<typeof RedactionDetailsForm> & TCoord,
    'onSaveSuccess' | 'onCancelClick'
  > | null>(null);

  const mousePos = useWindowMouseListener();

  return (
    <div>
      {popupProps &&
        (() => {
          const handleCloseModal = () => {
            setRedactions((prev) =>
              prev.filter((x) => !popupProps.redactionIds.includes(x.id))
            );
            setPopupProps(null);
          };

          return (
            <PdfRedactorMiniModal
              coordX={popupProps.x}
              coordY={popupProps.y}
              onBackgroundClick={handleCloseModal}
              onEscPress={handleCloseModal}
            >
              <RedactionDetailsForm
                redactionIds={popupProps.redactionIds}
                documentId={popupProps.documentId}
                urn={popupProps.urn}
                caseId={popupProps.caseId}
                onCancelClick={() => {
                  setRedactions((prev) =>
                    prev.filter((x) => !popupProps.redactionIds.includes(x.id))
                  );
                  setPopupProps(null);
                }}
                onSaveSuccess={() => setPopupProps(null)}
              />
            </PdfRedactorMiniModal>
          );
        })()}
      <PdfRedactor
        fileUrl={p.fileUrl}
        mode={p.mode}
        hideToolbar
        onModeChange={p.onModeChange}
        redactions={redactions}
        onRedactionsChange={(newRedactions) => setRedactions(newRedactions)}
        onAddRedactions={(add) => {
          const newRedactionDetails = add.map((x) => ({
            redactionId: x.id,
            randomId: `This redaction does ${crypto.randomUUID()}`
          }));
          setRedactionDetails((prev) => [...prev, ...newRedactionDetails]);
          setPopupProps(() => ({
            x: mousePos.current.x,
            y: mousePos.current.y,
            redactionIds: add.map((x) => x.id),
            documentId: 'This document does not exist',
            urn: 'This URN does not exist',
            caseId: 'This case does not exist'
          }));
        }}
        onRemoveRedactions={() => {}}
        onSaveRedactions={async (redactions) => {
          const redactionsWithDetails = redactions
            .map((x) => {
              const thisDetails = redactionDetails.find(
                (y) => y.redactionId === x.id
              );
              if (!thisDetails) return undefined;
              return { ...x, ...thisDetails };
            })
            .filter((x) => !!x);

          redactionsWithDetails;
        }}
      />
    </div>
  );
};

export const ReviewAndRedactPage = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const [documentIDs, setDocumentIDs] = useState<any[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');
  const [pdfFileData, setPdfFileData] = useState('');
  const [openDocumentIds, setOpenDocumentIds] = useState<string[]>([]);
  const [mode, setMode] = useState<TMode>('areaRedact');
  const pdfFileRef = useRef('');

  const handleCloseTab = (v: string | undefined) => {
    setOpenDocumentIds((prev) => prev.filter((el) => el !== v));
  };

  const [documentsDataList, setDocumentsDataList] = useState<
    TDocumentDataList[]
  >([]);
  const { useAxiosInstance, getDocuments, getPdfs } = GetDataFromAxios();

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
    getPdfs({
      axiosInstance: axiosInstance,
      urn: '54KR7689125',
      caseId: 2160797,
      documentId: 'PCD-141956',
      versionId: '141956',
      isOcrProcessed: true
    }).then((response) => {
      const blob = response.data;

      if (blob instanceof Blob) {
        const url = window.URL || window.webkitURL;
        const blobResponse = url.createObjectURL(blob);
        // setPdfFileData(blobResponse);
        pdfFileRef.current = blobResponse;
      }
    });
  }, [openDocumentIds]);

  useEffect(() => {
    const matchingDocuments = documentsDataList?.filter((item) => {
      return openDocumentIds?.includes(item.documentId);
    });

    const sortedMatchingDocuments = matchingDocuments?.sort(
      (a, b) =>
        openDocumentIds.indexOf(a.documentId) -
        openDocumentIds.indexOf(b.documentId)
    );

    const matchingResult = sortedMatchingDocuments?.map((item) => {
      return {
        id: item.documentId,
        label: item.presentationTitle,
        title: item.presentationTitle,
        fileName: item.cmsOriginalFileName,
        status: item.status
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
          >
            <DocumentViewportArea
              activeTabId={activeTabId}
              items={documentIDs}
              redactAreaState={mode === 'areaRedact'}
              onRedactAreaStateChange={(x) => {
                setMode(x ? 'areaRedact' : 'textRedact');
              }}
            />
            <CaseworkPdfRedactor
              // fileUrls left purposefully
              // fileUrl="http://localhost:3000/test-pdfs/may-plus-images.pdf"
              // fileUrl="http://localhost:3000/test-pdfs/final.pdf"

              // fileUrl={
              //   pdfFileData || `${window.location.origin}/pdfNotFound.pdf`
              // }
              fileUrl={pdfFileRef.current}
              onModeChange={setMode}
              mode={mode}
            />
          </DocumentControlArea>
        </TwoCol>
      </div>
    </Layout>
  );
};

