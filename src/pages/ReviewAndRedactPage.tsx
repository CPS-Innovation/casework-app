import { useState } from 'react';
import { DocumentSidebar } from '../packages/DocumentSelectAccordion/DocumentSidebar';
// import { CaseDetailsWrapper as CaseDetailsPage} from './caseWorkApp/components/presentation/caseDetails';
import { CaseDetailsWrapper  as CaseDetailsPage} from '../caseWorkApp/components/presentation/caseDetails';

export const ReviewAndRedactPage = () => {

  return (
    <div>
      <CaseDetailsPage />
    </div>
  );
};
