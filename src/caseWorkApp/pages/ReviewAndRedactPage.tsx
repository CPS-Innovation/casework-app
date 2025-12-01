import { ComponentProps, useEffect, useState } from 'react';
import { Layout, TwoCol } from '../../components';
import { DocumentSidebar } from '../../packages/DocumentSelectAccordion/DocumentSidebar';
import { PdfRedactorMiniModal } from '../../packages/PdfRedactor/modals/PdfRedactorMiniModal';
import { RedactionDetailsForm } from '../../packages/PdfRedactor/PdfRedactionTypeForm';
import { PdfRedactor } from '../../packages/PdfRedactor/PdfRedactor';
import {
  TCoord,
  TRedaction
} from '../../packages/PdfRedactor/utils/coordUtils';
import { TMode } from '../../packages/PdfRedactor/utils/modeUtils';
import { TIndexedRotation } from '../../packages/PdfRedactor/utils/rotationUtils';
import { useWindowMouseListener } from '../../packages/PdfRedactor/utils/useWindowMouseListener';
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

const CaseworkPdfRedactor = (p: {
  fileUrl: string;
  mode: TMode;
  onModeChange: (x: TMode) => void;
}) => {
  const [redactions, setRedactions] = useState<TRedaction[]>([]);
  const [indexedRotation, setIndexedRotation] = useState<TIndexedRotation>({});

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
        indexedRotation={indexedRotation}
        onRotationsChange={(newRotations) => setIndexedRotation(newRotations)}
      />
    </div>
  );
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
            ></DocumentViewportArea>
          </DocumentControlArea>

          <CaseworkPdfRedactor
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

