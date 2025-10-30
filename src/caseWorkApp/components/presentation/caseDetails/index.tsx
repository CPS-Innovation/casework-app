import React from 'react';
import { DocumentArea } from '../../documentArea';
import { TwoCol } from '../../../../components';

export const CaseDetailsWrapper: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({}) => (
  <div  className="govuk-main-wrapper">
     <TwoCol sidebar={<></>}>
    <DocumentArea></DocumentArea>
    <div>fldknflk</div>    
    </TwoCol>
  </div>
);

