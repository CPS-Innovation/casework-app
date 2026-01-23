import { useEffect, useRef, useState } from 'react';
import { getPdfFiles } from '../../caseWorkApp/components/utils/getData';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { CaseworkPdfRedactorWrapper } from '../CaseworkPdfRedactorWrapper/CaseworkPdfRedactorWrapper';
import { useAxiosInstance } from '../DocumentSelectAccordion/getters/getAxiosInstance';
import { TDocument } from '../DocumentSelectAccordion/getters/getDocumentList';
import { DocumentViewportArea } from '../documenViewportArea';
import { TRedaction } from '../PdfRedactor/utils/coordUtils';
import { TMode } from '../PdfRedactor/utils/modeUtils';

type LoadStatus = 'loading' | 'error' | 'success';

export type DocumentTabPanelProps = {
  documentId: string;
  versionId: number;
  document: TDocument;
  urn: string;
  caseId: number;
  mode: TMode;
  onModeChange: (mode: TMode) => void;
  onRedactionsChange: (redactions: TRedaction[]) => void;
  onModification: () => void;
  onViewInNewWindowClick: () => void;
  initRedactions?: TRedaction[];
};

export const DocumentTabPanel = ({
  documentId,
  versionId,
  document,
  urn,
  caseId,
  mode,
  onModeChange,
  onRedactionsChange,
  onModification,
  initRedactions,
  onViewInNewWindowClick
}: DocumentTabPanelProps) => {
  const axiosInstance = useAxiosInstance();
  const axiosInstanceRef = useRef(axiosInstance);
  axiosInstanceRef.current = axiosInstance;

  const [pdfFileUrl, setPdfFileUrl] = useState<string>('');
  const [status, setStatus] = useState<LoadStatus>('loading');
  const blobUrlRef = useRef<string | null>(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    let isMounted = true;

    const loadPdf = async () => {
      setStatus('loading');

      try {
        const blob = await getPdfFiles({
          axiosInstance: axiosInstanceRef.current,
          urn,
          caseId,
          documentId,
          versionId
        });

        if (!isMounted) return;

        if (blob instanceof Blob) {
          const url = URL.createObjectURL(blob);
          blobUrlRef.current = url;
          setPdfFileUrl(url);
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch {
        if (isMounted) {
          setStatus('error');
        }
      }
    };

    loadPdf();

    return () => {
      isMounted = false;
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, [documentId, versionId, urn, caseId]);

  return (
    <div>
      {status === 'loading' && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '300px'
          }}
        >
          <LoadingSpinner textContent="Loading document..." />
        </div>
      )}

      {status === 'error' && (
        <div className="govuk-error-message">Failed to load Document</div>
      )}

      {status === 'success' && pdfFileUrl && (
        <>
          <DocumentViewportArea
            documentName={document.presentationTitle}
            mode={mode}
            onModeChange={onModeChange}
            onViewInNewWindowButtonClick={onViewInNewWindowClick}
          />
          <CaseworkPdfRedactorWrapper
            fileUrl={pdfFileUrl}
            mode={mode}
            onModeChange={onModeChange}
            onModification={onModification}
            urn={urn}
            caseId={caseId}
            versionId={versionId}
            documentId={documentId}
            document={document}
            onRedactionsChange={onRedactionsChange}
            initRedactions={initRedactions ?? []}
          />
        </>
      )}
    </div>
  );
};

