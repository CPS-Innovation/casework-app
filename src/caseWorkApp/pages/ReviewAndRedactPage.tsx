import { ComponentProps, useEffect, useState } from 'react';
import { Layout, TwoCol } from '../../components';
import { DocumentSidebar } from '../../packages/DocumentSelectAccordion/DocumentSidebar';
import { PdfRedactorMiniModal } from '../../packages/PdfRedactor/modals/PdfRedactorMiniModal';
import { DeletionReasonForm } from '../../packages/PdfRedactor/PdfDeletionReasonForm';
import { RedactionDetailsForm } from '../../packages/PdfRedactor/PdfRedactionTypeForm';
import { PdfRedactor } from '../../packages/PdfRedactor/PdfRedactor';
import {
  TCoord,
  TRedaction
} from '../../packages/PdfRedactor/utils/coordUtils';
import { TIndexedDeletion } from '../../packages/PdfRedactor/utils/deletionUtils';
import { TMode } from '../../packages/PdfRedactor/utils/modeUtils';
import { TIndexedRotation } from '../../packages/PdfRedactor/utils/rotationUtils';
import { useWindowMouseListener } from '../../packages/PdfRedactor/utils/useWindowMouseListener';
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
  // items: any;
};

const CaseworkPdfRedactor = (p: {
  fileUrl: string;
  mode: TMode;
  onModeChange: (x: TMode) => void;
  // items: { id: string; label: string; title: string; versionId: number }[];
}) => {
  const [redactions, setRedactions] = useState<TRedaction[]>([]);
  const [indexedRotation, setIndexedRotation] = useState<TIndexedRotation>({});
  const [indexedDeletion, setIndexedDeletion] = useState<TIndexedDeletion>({});

  const [redactionDetails, setRedactionDetails] = useState<
    { redactionId: string; randomId: string }[]
  >([]);
  const [deletionDetails, setDeletionDetails] = useState<
    { deletionId: string; randomId: string }[]
  >([]);

  // useEffect(() => {
  //   const pdf = p.items.find((item) => item.id === p.currentActiveTabId);
  //   console.log('currentActiveTabId: ', pdf);
  // }, [p.currentActiveTabId]);

  useEffect(() => {
    const redactionIds = redactions.map((red) => red.id);
    setRedactionDetails((prev) =>
      prev.filter((redDetail) => redactionIds.includes(redDetail.redactionId))
    );
  }, [redactions]);

  useEffect(() => {
    const deletionIds = Object.values(indexedDeletion)
      .filter((del) => del.isDeleted)
      .map((del) => del.id);
    setDeletionDetails((prev) =>
      prev.filter((detail) => deletionIds.includes(detail.deletionId))
    );
  }, [indexedDeletion]);

  const [redactionPopupProps, setRedactionPopupProps] = useState<Omit<
    ComponentProps<typeof RedactionDetailsForm> & TCoord,
    'onSaveSuccess' | 'onCancelClick'
  > | null>(null);
  const [deleteReasonPopupProps, setDeleteReasonPopupProps] = useState<Omit<
    ComponentProps<typeof DeletionReasonForm> & TCoord,
    'onSaveSuccess' | 'onCancelClick'
  > | null>(null);

  const mousePos = useWindowMouseListener();

  return (
    <div>
      {redactionPopupProps &&
        (() => {
          const handleCloseModal = () => {
            setRedactions((prev) =>
              prev.filter(
                (x) => !redactionPopupProps.redactionIds.includes(x.id)
              )
            );
            setRedactionPopupProps(null);
          };

          return (
            <PdfRedactorMiniModal
              coordX={redactionPopupProps.x}
              coordY={redactionPopupProps.y}
              onBackgroundClick={handleCloseModal}
              onEscPress={handleCloseModal}
            >
              <RedactionDetailsForm
                redactionIds={redactionPopupProps.redactionIds}
                documentId={redactionPopupProps.documentId}
                urn={redactionPopupProps.urn}
                caseId={redactionPopupProps.caseId}
                onCancelClick={() => {
                  setRedactions((prev) =>
                    prev.filter(
                      (x) => !redactionPopupProps.redactionIds.includes(x.id)
                    )
                  );
                  setRedactionPopupProps(null);
                }}
                onSaveSuccess={() => setRedactionPopupProps(null)}
              />
            </PdfRedactorMiniModal>
          );
        })()}
      {deleteReasonPopupProps &&
        (() => {
          const handleCloseModal = () => {
            setIndexedDeletion((prev) => {
              const { [deleteReasonPopupProps.pageNumber]: _, ...rest } = prev;
              return rest;
            });
            setDeleteReasonPopupProps(null);
          };

          return (
            <PdfRedactorMiniModal
              coordX={deleteReasonPopupProps.x}
              coordY={deleteReasonPopupProps.y}
              onBackgroundClick={handleCloseModal}
              onEscPress={handleCloseModal}
            >
              <DeletionReasonForm
                pageNumber={deleteReasonPopupProps.pageNumber}
                documentId={deleteReasonPopupProps.documentId}
                urn={deleteReasonPopupProps.urn}
                caseId={deleteReasonPopupProps.caseId}
                onCancelClick={() => {
                  setIndexedDeletion((prev) => {
                    const { [deleteReasonPopupProps.pageNumber]: _, ...rest } =
                      prev;
                    return rest;
                  });
                  setDeleteReasonPopupProps(null);
                }}
                onSaveSuccess={() => setDeleteReasonPopupProps(null)}
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
          setRedactionPopupProps(() => ({
            x: mousePos.current.x,
            y: mousePos.current.y,
            redactionIds: add.map((x) => x.id),
            documentId: 'This document does not exist',
            urn: 'This URN does not exist',
            caseId: 'This case does not exist'
          }));
        }}
        onRemoveRedactions={() => {}}
        onSaveRedactions={async () => {
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
        indexedDeletion={indexedDeletion}
        onDeletionsChange={(newDeletions) => setIndexedDeletion(newDeletions)}
        onDeletionAdd={(add) => {
          const newDeletionDetails = {
            deletionId: add.id,
            randomId: `This deletion does ${crypto.randomUUID()}`
          };
          setDeletionDetails((prev) => [...prev, newDeletionDetails]);
          setDeleteReasonPopupProps(() => ({
            x: mousePos.current.x,
            y: mousePos.current.y,
            pageNumber: add.pageNumber,
            documentId: 'This document does not exist',
            urn: 'This URN does not exist',
            caseId: 'This case does not exist'
          }));
        }}
        onDeletionRemove={() => {}}
        onSaveDeletions={async () => {
          const deletionsWithDetails = Object.values(indexedDeletion)
            .map((x) => {
              const thisDetails = deletionDetails.find(
                (y) => y.deletionId === x.id
              );
              if (!thisDetails) return undefined;
              return { ...x, ...thisDetails };
            })
            .filter((x) => !!x);

          deletionsWithDetails;
        }}
        onSaveRotations={async () => {
          // rotations don't require details
        }}
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
  const [pdfFileUrl, setPdfFileUrl] = useState<string>('');
  // const pdfFileRef = useRef('');

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

    documentsDataList?.filter((item) => {
      if (item.documentId === targetDocumentId) {
        getPdfFiles({
          axiosInstance: axiosInstance,
          urn: item?.documentId,
          caseId: '2160797', // TODO - make it dynamic
          documentId: item?.documentId,
          versionId: item?.versionId
        }).then((blob) => {
          if (blob instanceof Blob) {
            const url = window.URL || window.webkitURL;
            const blobResponse = url.createObjectURL(blob);
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
                ></DocumentViewportArea>
              </DocumentControlArea>

              <CaseworkPdfRedactor
                // fileUrls left purposefully
                // fileUrl="http://localhost:3000/test-pdfs/may-plus-images.pdf"
                // fileUrl="http://localhost:3000/test-pdfs/final.pdf"

                // fileUrl="http://localhost:3000/test-pdfs/final-with-https.pdf"
                // fileUrl={pdfFileRef.current}
                fileUrl={pdfFileUrl}
                mode={mode}
                onModeChange={setMode}
                // items={documentIDs}
                // currentActiveTabId={currentActiveTabId}
              />
            </>
          )}
        </TwoCol>
      </div>
    </Layout>
  );
};

