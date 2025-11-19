import { useState } from 'react';
import { Layout, TwoCol } from '../../components';
import { DocumentSidebar } from '../../packages/DocumentSelectAccordion/DocumentSidebar';
import { PdfViewer } from '../../packages/pdfViewer/PdfViewer';
import { createId } from '../../packages/pdfViewer/utils/generalUtils';
import { DocumentControlArea } from '../components/documentControlArea';
import { DocumentViewportArea } from '../components/documenViewportArea';

export const ReviewAndRedactPage = () => {
  const [openDocumentIds, setOpenDocumentIds] = useState<string[]>([]);

  const [redactionDetails, setRedactionDetails] = useState<
    { redactionId: string; randomId: string; type: string }[]
  >([]);

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

          <PdfViewer
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
                randomId: createId(),
                type: `This redaction does something`
              }));
              setRedactionDetails((prev) => [...prev, ...newRedactions]);
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
