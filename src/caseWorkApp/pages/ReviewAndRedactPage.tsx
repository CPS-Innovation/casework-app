import { useEffect, useState } from 'react';
import { TwoCol } from '../../components';
import { DocumentSidebar } from '../../packages/DocumentSelectAccordion/DocumentSidebar';
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
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const [documentIDs, setDocumentIDs] = useState<any[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('')
  const [removedDocumentId, setRemovedDocumentId] = useState<
    TDocumentDataList | undefined
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

  const handleCloseTab = (v: string) => {
    setRemovedDocumentId(v as any);
  };

  useEffect(() => {
    console.log('opendocumentid: ', openDocumentIds);
    const matchingDocuments = documentsDataList.filter((item) => {
      return openDocumentIds.includes(item.documentId);
    });

    const matchingResult = matchingDocuments?.map((item) => {
      return {
        id: item.documentId,
        label: item.presentationTitle,
        title: item.presentationTitle
      };
    });

    setDocumentIDs(matchingResult);
    // setDocumentIDs((prevState) => {
    //   console.log(prevState);
    //   return {...prevState, matchingResult};
    // });
  }, [openDocumentIds]);

  useEffect(() => {
    setActiveTabId(openDocumentIds[openDocumentIds.length-1])
  }, [openDocumentIds]);

  useEffect(() => {
    const newArray = documentIDs?.filter((e) => {
      return e.id !== removedDocumentId?.id;
    });
    setDocumentIDs(newArray);

    // setDocumentIDs((prevState) =>
    //   prevState.filter((e) => {
    //     return e.id !== removedDocumentId?.id;
    //   })
    // );
  }, [removedDocumentId]);

  return (
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
        <>
          <DocumentControlArea
            activeTabId={activeTabId}
            items={documentIDs}
            isSidebarVisible={isSidebarVisible}
            onToggleSidebar={() => setIsSidebarVisible((v) => !v)}
            handleCloseTab={handleCloseTab}
          >
            <DocumentViewportArea items={documentIDs}></DocumentViewportArea>
          </DocumentControlArea>
        </>
      </TwoCol>
    </div>
  );
};

