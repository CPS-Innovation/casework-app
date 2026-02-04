import pdfWorker from 'pdfjs-dist/build/pdf.worker?url';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { usePagination } from 'react-use-pagination';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner.tsx';
import { Pagination } from '../Pagination/Pagination.tsx';
import './PdfViewer.css';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

// TODO: update 'file' type
type Props = { file: any; fileName: string };

export const PdfViewer = ({ file, fileName }: Props) => {
  // eslint-disable-next-line no-unused-vars
  const [numItems, setNumItems] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { currentPage, setNextPage, setPreviousPage, setPage, totalPages } =
    usePagination({ initialPageSize: 1, totalItems: numItems });

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumItems(numPages);
    setIsLoading(false);
  }

  return (
    <div>
      <div
        aria-live="polite"
        aria-atomic="true"
        className="govuk-visually-hidden"
      >
        {isLoading
          ? `The document preview for ${fileName} is loading. Please wait.`
          : `The document "${fileName}" has finished loading and is ready to view. Please use the arrow keys to navigate through the document.`}
      </div>
      <Document
        className="pdf-page-container"
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<LoadingSpinner textContent="Loading preview..." />}
        aria-label={
          isLoading
            ? `The document preview for ${fileName} is loading. Please wait.`
            : `The document "${fileName}" has finished loading and is ready to view. Please use the arrow keys to navigate through the document.`
        }
      >
        <div className="pagination-wrapper">
          <Pagination
            setPage={setPage}
            setNextPage={setNextPage}
            setPreviousPage={setPreviousPage}
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </div>
        <Page
          pageNumber={currentPage + 1}
          renderTextLayer={true}
          renderAnnotationLayer={true}
        />
        <div className="pagination-wrapper">
          <Pagination
            setPage={setPage}
            setNextPage={setNextPage}
            setPreviousPage={setPreviousPage}
            totalPages={totalPages}
            currentPage={currentPage}
          />
        </div>
      </Document>
    </div>
  );
};
