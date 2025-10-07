import { CaseMaterialsType } from '../../schemas/caseMaterials';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { ErrorSummary } from '../ErrorSummary/ErrorSummary';
import { PdfViewer } from '../PdfViewer/PdfViewer';
import { useDocumentPreview } from '../../hooks/useDocumentPreview';

type Props = { row: CaseMaterialsType };

export default function DocumentPreview({ row }: Props) {
  const {
    data: caseDocumentData,
    loading: caseDocumentLoading,
    error: caseDocumentError
  } = useDocumentPreview({ materialId: row.materialId });

  if (caseDocumentLoading) {
    return <LoadingSpinner textContent="Loading preview..." />;
  }

  if (caseDocumentError) {
    return (
      <ErrorSummary
        errorTitle="No preview available"
        errorMessage="The material you are trying to preview is not currently available. You can view it in the CMS."
      />
    );
  }

  return caseDocumentData ? (
    <PdfViewer file={caseDocumentData} fileName={row.subject} />
  ) : null;
}
