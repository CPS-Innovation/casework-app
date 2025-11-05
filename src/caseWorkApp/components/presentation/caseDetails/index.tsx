import React from 'react';
import { TwoCol } from '../../../../components';
import { DocumentControlArea } from '../../documentControlArea';
import { DocumentViewportArea } from '../../documenViewportArea';

const CaseDetailsWrapper: React.FC<{}> = () => {

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
        <DocumentViewportArea></DocumentViewportArea>
      </TwoCol>
    </div>
  );
};

export { CaseDetailsWrapper };
