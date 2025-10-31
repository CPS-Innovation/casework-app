import React from 'react';
import { DocumentControlArea } from '../../documentControlArea';
import { TwoCol } from '../../../../components';

export const CaseDetailsWrapper: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({}) => (
  <div  className="govuk-main-wrapper">
     <TwoCol sidebar={<></>}>
    <DocumentControlArea></DocumentControlArea>
    <div>fldknflk</div>    
    </TwoCol>
  </div>
);

