import { TLookupsResponse } from '../../caseWorkApp/types/redaction';
import { TDocument } from '../DocumentSelectAccordion/getters/getDocumentList';
import { Modal } from './Modal';
import styles from './RedactionLogModal.module.scss';
import { RedactionLogModalHeader } from './RedactionLogModalHeader';

type RedactionLogModalProps = {
  urn: string;
  caseId?: number;
  activeDocument: TDocument | null;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  lookups?: TLookupsResponse;
};

export const RedactionLogModal = ({
  urn,
  activeDocument,
  isOpen,
  onClose,
  lookups
}: RedactionLogModalProps) => {
  if (!isOpen) return null;
  return (
    <Modal onClose={onClose}>
      <RedactionLogModalHeader urn={urn} lookups={lookups} />

      <div className={styles.modalBody}>
        <h2>Redaction details for: {activeDocument?.presentationTitle}</h2>
      </div>

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
