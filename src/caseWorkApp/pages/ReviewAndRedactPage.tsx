import { useEffect, useState } from 'react';
import { TwoCol } from '../../components';
import { DocumentSidebar } from '../../packages/DocumentSelectAccordion/DocumentSidebar';
import { DocumentControlArea } from '../components/documentControlArea';
import { DocumentViewportArea } from '../components/documenViewportArea';
import { GetDataFromAxios } from '../utils/data';

type TU = {
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
  const [removedDocumentId, setRemovedDocumentId] = useState<
    { id: string; label: string; title: string } | undefined
  >(undefined);
  const [documentsDataList, setDocumentsDataList] = useState<TU[]>([]);

  const { useAxiosInstance, getDocuments } = GetDataFromAxios();

  const a = useAxiosInstance();

  useEffect(() => {
    const getDocument = getDocuments({
      axiosInstance: a,
      urn: '54KR7689125',
      caseId: 2160797
    }).then((e) => {
      setDocumentsDataList(e);
      console.log('dataaaa', e);
    });
  }, []);

  const handleCloseTab = (v: string) => {
    setRemovedDocumentId(v as any);
  };

  // const getDetails = () => {
  //   openDocumentIds.map((el, index) => {
  //     return documentsDataList?.filter((item) => {
  //       if (item.documentId === el) {
  //         const el = {
  //           id: item.documentId,
  //           label: item.presentationTitle,
  //           title: item.presentationTitle
  //         };
  //         setDocumentIDs(el as any);
  //       }
  //     });
  //   });
  // };

  useEffect(() => {
    console.log('oid: ', openDocumentIds);

    // const res = openDocumentIds?.find((i) => {
    //    return documentsDataList.find((item) => {
    //     if ( item.documentId === i ) {
    //       return {
    //         id: 'item.documentId',
    //         label: 'item.presentationTitle',
    //         title: 'item.presentationTitle'
    //       }
    //     }
    //   });
    // });
    // // setDocumentIDs(res as any)
    // console.log(res);

    const matchingDocuments = documentsDataList.filter((item) => {
      if(openDocumentIds.includes(item.documentId)) {

        return {
          id: item.documentId,
          label: item.presentationTitle,
          title: item.presentationTitle
        };
      }
    });    
    setDocumentIDs(matchingDocuments)
    console.log('md: ', matchingDocuments);
  }, [openDocumentIds]);

  // useEffect(() => {
  //   const res = openDocumentIds?.map((item) => {
  //     return { id: item, label: item, title: item };
  //   });

  //   setDocumentIDs(res);
  // }, [openDocumentIds]);

  useEffect(() => {
    const newArray = documentIDs?.filter((e) => {
      return e.id !== (removedDocumentId?.id as string);
    });
    setDocumentIDs(newArray);
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
            items={documentIDs}
            isSidebarVisible={isSidebarVisible}
            onToggleSidebar={() => setIsSidebarVisible((v) => !v)}
            handleCloseTab={handleCloseTab}
          />
          <DocumentViewportArea></DocumentViewportArea>
        </>
      </TwoCol>
    </div>
  );
};

