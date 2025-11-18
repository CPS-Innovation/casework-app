import { useState, useEffect } from 'react';
import { Layout, TwoCol } from '../../components';
import { DocumentSidebar } from '../../packages/DocumentSelectAccordion/DocumentSidebar';
import { PdfViewer } from '../../packages/pdfViewer/PdfViewer';
import { createId } from '../../packages/pdfViewer/utils/generalUtils';
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
  const [openDocumentIds, setOpenDocumentIds] = useState<string[]>([]);

  const [redactionDetails, setRedactionDetails] = useState<
    { redactionId: string; randomId: string; type: string }[]
  >([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const [documentIDs, setDocumentIDs] = useState<any[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');
  const [removedDocumentId, setRemovedDocumentId] = useState<
    string | undefined
  >(undefined);

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

  const handleCloseTab = (v:string | undefined) => {
  // const newDocumentData: Pick<TDocumentDataList, 'id'> |  undefined = {
  //   id,
  // };
  // console.log('new dara', newDocumentData.id);
    setRemovedDocumentId(v);
    setOpenDocumentIds(prev => prev.filter( el => el !== v))  
  };

  useEffect(() => {
    const matchingDocuments = documentsDataList
      .filter((item) => {
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
    const newArray = documentIDs?.filter((e) => {
      return e.id !== removedDocumentId;
    });
    setDocumentIDs(newArray);
  }, [removedDocumentId]);

  useEffect(() => {
    const lastId =
      openDocumentIds.length > 0
        ? openDocumentIds[openDocumentIds.length - 1]
        : '';
    setActiveTabId(lastId);
  }, [openDocumentIds]);

  return (
    <Layout>
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
            handleCloseTab={(a)=>handleCloseTab(a)}
          >
            <DocumentViewportArea
              activeTabId={activeTabId}
              items={documentIDs}
            ></DocumentViewportArea>
          </DocumentControlArea>

          <PdfViewer
            // fileUrls left purposefully
            // fileUrl="http://localhost:3000/test-pdfs/may-plus-images.pdf"
            // fileUrl="http://localhost:3000/test-pdfs/final.pdf"
            fileUrl="https://www.orimi.com/pdf-test.pdf"
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
