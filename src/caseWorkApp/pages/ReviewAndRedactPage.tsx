import { ComponentProps, useEffect, useState } from 'react';
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

const items = [
  {
    isDirty: false,
    id: 'CMS-MG1',
    versionId: 1,
    label: 'MG1 CARMINE Victim',
    panel: <></>
  },
  {
    isDirty: false,
    id: 'CMS-MG2',
    versionId: 2,
    label: 'MG2 CARMINE Victim',
    panel: <></>
  }
];

const CaseworkPdfRedactor = (p: { fileUrl: string }) => {
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
  const [mode, setMode] = useState<TMode>('areaRedact');

  return (
    <div>
      {popupProps && (
        <PdfRedactorMiniModal
          coordX={popupProps.x}
          coordY={popupProps.y}
          onBackgroundClick={() => {
            setRedactions((prev) =>
              prev.filter((x) => !popupProps.redactionIds.includes(x.id))
            );
            setPopupProps(null);
          }}
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
      )}
      <PdfRedactor
        fileUrl={p.fileUrl}
        mode={mode}
        hideToolbar
        onModeChange={setMode}
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
  const [openDocumentIds, setOpenDocumentIds] = useState<string[]>([]);

  return (
    <Layout>
      <div className="govuk-main-wrapper">
        <TwoCol
          sidebar={
            <DocumentSidebar
              urn="54KR7689125"
              caseId={2160797}
              openDocumentIds={openDocumentIds}
              onSetDocumentOpenIds={(docIds) => setOpenDocumentIds(docIds)}
            />
          }
        >
          <DocumentControlArea items={items}></DocumentControlArea>

          <DocumentViewportArea></DocumentViewportArea>

          <CaseworkPdfRedactor
            // fileUrls left purposefully
            // fileUrl="http://localhost:3000/test-pdfs/may-plus-images.pdf"
            // fileUrl="http://localhost:3000/test-pdfs/final.pdf"
            fileUrl="http://localhost:3000/test-pdfs/final-with-https.pdf"
          />
        </TwoCol>
      </div>
    </Layout>
  );
};
