import { TDocument } from '../../../materials_components/DocumentSelectAccordion/getters/getDocumentList';
import { TRedaction } from '../../../materials_components/PdfRedactor/utils/coordUtils';
import { Button } from '../../components/button';
import { Modal } from './Modal';

export type UnsavedRedactionsModalProps = {
  redactionsIndexedOnDocumentId: { [k: string]: TRedaction[] };
  documents: TDocument[];
  onReturnClick: () => void;
  onIgnoreClick: () => void;
  onDocumentClick: (documentId: string) => void;
};

export const UnsavedRedactionsModal = ({
  redactionsIndexedOnDocumentId,
  documents,
  onReturnClick,
  onIgnoreClick,
  onDocumentClick
}: UnsavedRedactionsModalProps) => {
  const documentIdsWithRedactions = Object.keys(
    redactionsIndexedOnDocumentId
  ).filter(
    (docId) =>
      redactionsIndexedOnDocumentId[docId] &&
      redactionsIndexedOnDocumentId[docId].length > 0
  );

  const documentsWithRedactions = documents.filter((doc) =>
    documentIdsWithRedactions.includes(doc.documentId)
  );

  return (
    <Modal onBackgroundClick={onIgnoreClick} onEscPress={onIgnoreClick}>
      <div style={{ padding: '20px', background: 'white' }}>
        <div>
          You have {documentsWithRedactions.length} documents with unsaved
          redactions
        </div>
        <br />
        <div style={{ display: 'flex', gap: '4px', flexDirection: 'column' }}>
          {documentsWithRedactions.map((doc) => (
            <a
              className="govuk-link"
              key={doc.documentId}
              onClick={() => onDocumentClick(doc.documentId)}
            >
              {doc.presentationTitle}
            </a>
          ))}
        </div>
        <br />
        <div>
          If you do not save the redactions the file will not be changed.
        </div>
        <br />
        <div style={{ display: 'flex', gap: '16px' }}>
          <Button variant="primary" onClick={onReturnClick}>
            Return to case file
          </Button>
          <Button variant="inverse" onClick={onIgnoreClick}>
            Ignore
          </Button>
        </div>
      </div>
    </Modal>
  );
};
