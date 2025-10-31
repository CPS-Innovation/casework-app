import React from 'react';
import { TwoCol } from '../../../../components';
import { DocumentControlArea } from '../../documentControlArea';
import { DocumentViewportArea } from '../../documenViewportArea';

const CaseDetailsWrapper: React.FC<{}> = () => {
  // const items = [
  //   {
  //     documentId: 'CMS-8806663',
  //     status: 'New',
  //     versionId: 8051177,
  //     cmsDocType: {
  //       documentTypeId: 1200,
  //       documentType: 'OTHER MATERIAL',
  //       documentCategory: 'OtherForm'
  //     },
  //     cmsOriginalFileName: 'Report fileUM.pdf',
  //     presentationTitle: 'Report fileUM',
  //     cmsFileCreatedDate: '2025-03-31T23:00:00Z',
  //     isOcrProcessed: true,
  //     categoryListOrder: null,
  //     presentationFlags: { read: 'Ok', write: 'Ok' },
  //     parentDocumentId: '',
  //     witnessId: null,
  //     hasFailedAttachments: false,
  //     hasNotes: false,
  //     conversionStatus: 'DocumentConverted',
  //     piiVersionId: null,
  //     isUnused: true,
  //     isInbox: true,
  //     classification: 'Other',
  //     isWitnessManagement: false,
  //     canReclassify: true,
  //     canRename: true,
  //     renameStatus: 'CanRename',
  //     reference: null
  //   },
  //   {
  //     documentId: 'CMS-8806662',
  //     status: 'New',
  //     versionId: 8051176,
  //     cmsDocType: {
  //       documentTypeId: 1200,
  //       documentType: 'OTHER MATERIAL',
  //       documentCategory: 'OtherForm'
  //     },
  //     cmsOriginalFileName: 'MG6C Report 2.docx',
  //     presentationTitle: 'MG6C Item2',
  //     cmsFileCreatedDate: '2025-03-31T23:00:00Z',
  //     isOcrProcessed: true,
  //     categoryListOrder: null,
  //     presentationFlags: { read: 'Ok', write: 'Ok' },
  //     parentDocumentId: '',
  //     witnessId: null,
  //     hasFailedAttachments: false,
  //     hasNotes: false,
  //     conversionStatus: 'DocumentConverted',
  //     piiVersionId: null,
  //     isUnused: true,
  //     isInbox: true,
  //     classification: 'Other',
  //     isWitnessManagement: false,
  //     canReclassify: true,
  //     canRename: true,
  //     renameStatus: 'CanRename',
  //     reference: null
  //   }
  // ];
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
    <div className="govuk-main-wrapper">
      <TwoCol sidebar={<></>}>
        <DocumentControlArea items={items} ></DocumentControlArea>
        <DocumentViewportArea items={items}></DocumentViewportArea>
      </TwoCol>
    </div>
  );
};

export { CaseDetailsWrapper };
