import React from 'react';
import { PageContentWrapper } from '../../PageWrapper';
import { DocumentArea } from '../../documentArea';
import classes from './index.module.scss';

export const CaseDetailsWrapper: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = ({}) => (
  <PageContentWrapper>
    <div className={""}>
      <DocumentArea></DocumentArea>
    </div>
  </PageContentWrapper>
);
