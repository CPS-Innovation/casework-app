import { ComponentProps, useState } from 'react';
import { Layout, TwoCol } from '../../components';
import { DocumentSidebar } from '../../packages/DocumentSelectAccordion/DocumentSidebar';
import { PdfRedactor } from '../../packages/PdfRedactor/PdfRedactor';
import {
  PdfRedactorMiniModal,
  RedactionDetailsForm,
  useWindowMouseListener
} from '../../packages/PdfRedactor/PdfRedactorMiniModal';
import { TCoord } from '../../packages/PdfRedactor/utils/coordUtils';
import { createId } from '../../packages/PdfRedactor/utils/generalUtils';
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

export const ReviewAndRedactPage = () => {
  const [openDocumentIds, setOpenDocumentIds] = useState<string[]>([]);

  const [redactionDetails, setRedactionDetails] = useState<
    { redactionId: string; randomId: string }[]
  >([]);

  const [popupProps, setPopupProps] = useState<Omit<
    ComponentProps<typeof RedactionDetailsForm> & TCoord,
    'onSaveSuccess' | 'onCancelClick'
  > | null>(null);

  const mousePos = useWindowMouseListener();

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

          {popupProps && (
            <PdfRedactorMiniModal
              coordX={popupProps.x}
              coordY={popupProps.y}
              onBackgroundClick={() => setPopupProps(null)}
            >
              <RedactionDetailsForm
                redactionIds={popupProps.redactionIds}
                documentId={popupProps.documentId}
                urn={popupProps.urn}
                caseId={popupProps.caseId}
                onCancelClick={() => setPopupProps(null)}
                onSaveSuccess={() => setPopupProps(null)}
              />
            </PdfRedactorMiniModal>
          )}
          <PdfRedactor
            // fileUrls left purposefully
            // fileUrl="http://localhost:3000/test-pdfs/may-plus-images.pdf"
            // fileUrl="http://localhost:3000/test-pdfs/final.pdf"
            fileUrl="http://localhost:3000/test-pdfs/final-with-https.pdf"
            onRedactionsChange={(change) => {
              console.log(`OfficialPdfViewer.tsx:${/*LL*/ 16}`, { change });
            }}
            onAddRedactions={(add) => {
              const newRedactions = add.map((x) => ({
                redactionId: x.id,
                randomId: `This redaction does ${createId()}`
              }));
              setRedactionDetails((prev) => [...prev, ...newRedactions]);
              const coord = { x: window.screenX, y: window.screenY };
              console.log(`OfficialPdfViewer.tsx:${/*LL*/ 43}`, { coord });
              setPopupProps(() => ({
                x: mousePos.x,
                y: mousePos.y,
                redactionIds: add.map((x) => x.id),
                documentId: 'This document does not exist',
                urn: 'This URN does not exist',
                caseId: 'This case does not exist'
              }));
            }}
            onRemoveRedactions={(remove) => {
              setRedactionDetails((prev) =>
                prev.filter((x) => !remove.includes(x.redactionId))
              );
              console.log(`OfficialPdfViewer.tsx:${/*LL*/ 18}`, { remove });
            }}
            onSaveRedactions={(redactions) => {
              const redactionsWithDetails = redactions
                .map((x) => {
                  const thisDetails = redactionDetails.find(
                    (y) => y.redactionId === x.id
                  );
                  if (!thisDetails) return undefined;
                  return { ...x, ...thisDetails };
                })
                .filter((x) => !!x);
              console.log(`OfficialPdfViewer.tsx:${/*LL*/ 44}`, {
                redactionsWithDetails
              });
            }}
          />
        </TwoCol>
      </div>
    </Layout>
  );
};
