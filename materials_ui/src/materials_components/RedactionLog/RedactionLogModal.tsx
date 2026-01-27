import { TLookupsResponse } from '../../caseWorkApp/types/redaction';
import { TDocument } from '../DocumentSelectAccordion/getters/getDocumentList';
import { TRedaction } from '../PdfRedactor/utils/coordUtils';
import { Modal } from './Modal';
import styles from './RedactionLogModal.module.scss';
import { RedactionLogModalBody } from './RedactionLogModalBody';
import { RedactionLogModalHeader } from './RedactionLogModalHeader';

type RedactionLogModalProps = {
  urn: string;
  caseId?: number;
  activeDocument?: TDocument | null;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  lookups?: TLookupsResponse;
  mode?: 'over-under' | 'list';
  redactions?: TRedaction[];
};

export const RedactionLogModal = ({
  urn,
  activeDocument,
  isOpen,
  onClose,
  lookups,
  mode,
  redactions
}: RedactionLogModalProps) => {
  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <RedactionLogModalHeader urn={urn} lookups={lookups} />
      <RedactionLogModalBody
        activeDocument={activeDocument}
        mode={mode}
        redactions={redactions}
      />

      <div className={styles.modalFooter}>
        <div className="govuk-button-group">
          <button
            type="submit"
            className="govuk-button"
            data-module="govuk-button"
            onClick={() => null}
            data-testid="saveChangesButton"
          >
            Save and close
          </button>
          <button
            onClick={onClose}
            type="submit"
            className="govuk-button govuk-button--secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
