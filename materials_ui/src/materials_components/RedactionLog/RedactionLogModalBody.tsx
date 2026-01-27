import { TDocument } from '../DocumentSelectAccordion/getters/getDocumentList';
import { TRedaction } from '../PdfRedactor/utils/coordUtils';
import styles from './RedactionLogModal.module.scss';
import { Checkbox } from './templates/Checkbox';

type RedactionLogModalBodyProps = {
  activeDocument?: TDocument | null;
  mode?: 'over-under' | 'list';
  redactions?: TRedaction[];
};

export const RedactionLogModalBody = ({
  activeDocument,
  mode,
  redactions
}: RedactionLogModalBodyProps) => {
  return (
    <div className={styles.modalBody}>
      <h2>Redaction details for: {activeDocument?.presentationTitle}</h2>

      {mode === 'over-under' && (
        <div className="govuk-form-group">
          <legend className="govuk-fieldset__legend">
            Confirm the redaction type
          </legend>

          <div className="govuk-form-group">
            <Checkbox
              id="under-redaction"
              label="Under Redaction"
              hint="Returned to Investigative Agency for correction"
            />
            <Checkbox id="over-redaction" label="Over Redaction" />
          </div>
        </div>
      )}

      {redactions && redactions.length > 0 && (
        <div className="govuk-form-group">
          <legend className="govuk-fieldset__legend">Redaction details</legend>
          <ul className="govuk-list">
            {redactions.map((redaction) => (
              <li key={redaction.id}>
                {redaction.id} - Page {redaction.pageNumber}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="govuk-form-group">
        <label className="govuk-label" htmlFor="more-detail">
          Supporting notes (optional)
        </label>
        <textarea
          className="govuk-textarea"
          id="more-detail"
          name="moreDetail"
          rows={5}
          style={{ width: '50%' }}
        />
      </div>
    </div>
  );
};
