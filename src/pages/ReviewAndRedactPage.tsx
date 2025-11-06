import { useState } from 'react';
import { DocumentSidebar } from '../packages/DocumentSelectAccordion/DocumentSidebar';
// import { CaseDetailsWrapper as CaseDetailsPage} from './caseWorkApp/components/presentation/caseDetails';
import { CaseDetailsWrapper  as CaseDetailsPage} from '../caseWorkApp/components/presentation/caseDetails';

export const ReviewAndRedactPage = () => {
  const [openDocumentIds, setOpenDocumentIds] = useState<string[]>([]);

  return (
    <div>
      <CaseDetailsPage />
    </div>
  );
};
