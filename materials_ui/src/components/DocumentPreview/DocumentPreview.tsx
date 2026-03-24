import { useDocumentPreview } from '../../hooks/';
import { CaseMaterialsType } from '../../schemas/caseMaterials';
import { ErrorSummary } from '../ErrorSummary/ErrorSummary';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { LoadingStatusAnnouncer } from '../LoadingStatusAnnouncer/LoadingStatusAnnouncer';
import { PdfViewer } from '../PdfViewer/PdfViewer';

type Props = { row: CaseMaterialsType };

export default function DocumentPreview({ row }: Props) {
  const {
    data: caseDocumentData,
    loading: caseDocumentLoading,
    error: caseDocumentError
  } = useDocumentPreview({ materialId: row.materialId });

  return (
    <>
      <LoadingStatusAnnouncer
        isLoading={caseDocumentLoading}
        loadingMessage="Loading preview..."
      />

      {caseDocumentLoading && (
        <LoadingSpinner textContent="Loading preview..." />
      )}
      {!caseDocumentLoading && (
        caseDocumentError ? (
          <ErrorSummary
            errorTitle="No preview available"
            errorMessage="The material you are trying to preview is not currently available. You can view it in CMS."
          />
        ) : caseDocumentData ? (
          <PdfViewer file={caseDocumentData} fileName={row.subject} />
        ) : null
      )}
    </>
  );
}
