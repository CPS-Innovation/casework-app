import { useDocumentPreview } from '../../hooks/';
import { CaseMaterialsType } from '../../schemas/caseMaterials';
import { ErrorSummary } from '../ErrorSummary/ErrorSummary';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { PdfViewer } from '../PdfViewer/PdfViewer';
import { Banner } from '../../components';

type Props = { row: CaseMaterialsType };

export default function DocumentPreview({ row }: Props) {
  const {
    data: caseDocumentData,
    loading: caseDocumentLoading,
    error: caseDocumentError
  } = useDocumentPreview({ materialId: row.materialId });

  const errorTitle = caseDocumentError?.toString().includes('403') ?
    'This document is password protected' : 'No preview available';

  const errorMessage = caseDocumentError?.toString().includes('403') ?
    'Ask the agency who supplied it to remove the password and resend the document.' :
    'The material you are trying to preview is not currently available. You can view it in CMS.';

  let content = null;

  if (!caseDocumentLoading) {
    if (caseDocumentError) {
      content = caseDocumentError.toString().includes('403') ? (
        <Banner
          type="error"
          header={errorTitle}
          content={errorMessage}
        />
      ) : (
        <ErrorSummary
          errorTitle={errorTitle}
          errorMessage={errorMessage}
        />
      );
    } else if (caseDocumentData) {
      content = (
        <PdfViewer
          file={caseDocumentData}
          fileName={row.subject}
        />
      );
    }
  }

  return (
    <>
      <LoadingSpinner
        isLoading={caseDocumentLoading}
        textContent="Loading preview..."
      />
      {content}
    </>
  );
}
