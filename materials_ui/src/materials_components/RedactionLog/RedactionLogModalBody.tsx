import { useState } from 'react';
import { TDocument } from '../DocumentSelectAccordion/getters/getDocumentList';
import { TRedaction } from '../PdfRedactor/utils/coordUtils';
import styles from './RedactionLogModal.module.scss';
import { Checkbox } from './templates/Checkbox';

const redactionTypes = [
  { id: 1, name: 'Named individual ' },
  { id: 2, name: 'Title' },
  { id: 3, name: 'Occupation' },
  { id: 4, name: 'Relationship to others' },
  { id: 5, name: 'Address' },
  { id: 6, name: 'Location' },
  { id: 7, name: 'Vehicle registration' },
  { id: 8, name: 'NHS number' },
  { id: 9, name: 'Date of birth' },
  { id: 10, name: 'Bank details' },
  { id: 11, name: 'NI Number' },
  { id: 12, name: 'Phone number' },
  { id: 13, name: 'Email address' },
  { id: 14, name: 'Previous convictions' },
  { id: 15, name: 'Other' }
];

type Mode = 'over-under' | 'list';
type Category = 'under' | 'over' | null;
type OverReason = 'investigative-agency' | 'cps-colleague' | null;

type RedactionLogModalBodyProps = {
  activeDocument?: TDocument | null;
  mode?: Mode;
  redactions?: TRedaction[];
};

const RedactionTypesGrid = ({
  selected,
  onToggle
}: {
  selected: Set<number>;
  onToggle: (id: number) => void;
}) => {
  return (
    <div
      className="govuk-checkboxes__conditional"
      id="conditional-contact"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
        marginTop: '8px'
      }}
    >
      {redactionTypes.map((type) => (
        <Checkbox
          key={`${type.id}-${type.name}`}
          id={`redaction-type-${type.id}-${type.name}`}
          label={type.name}
          checked={selected.has(type.id)}
          onChange={() => onToggle(type.id)}
          isSmall={true}
        />
      ))}
    </div>
  );
};

export const RedactionLogModalBody = ({
  activeDocument,
  mode,
  redactions
}: RedactionLogModalBodyProps) => {
  const [category, setCategory] = useState<Category>(null);
  const [selectedTypes, setSelectedTypes] = useState<Set<number>>(new Set());

  const toggleType = (id: number) => {
    setSelectedTypes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

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
              checked={category === 'under'}
              onChange={() =>
                setCategory(category === 'under' ? null : 'under')
              }
            />

            {category === 'under' && (
              <RedactionTypesGrid
                selected={selectedTypes}
                onToggle={toggleType}
              />
            )}

            <Checkbox
              id="over-redaction"
              label="Over Redaction"
              checked={category === 'over'}
              onChange={() => setCategory(category === 'over' ? null : 'over')}
            />

            {category === 'over' && (
              <div className="govuk-form-group" style={{ marginTop: '8px' }}>
                <div
                  className="govuk-radios__conditional"
                  data-module="govuk-radios"
                >
                  <div className="govuk-radios__item">
                    <input
                      className="govuk-radios__input"
                      id="over-reason-ia"
                      name="over-reason"
                      type="radio"
                      value="investigative-agency"
                    />
                    <label
                      className="govuk-label govuk-radios__label"
                      htmlFor="over-reason-ia"
                    >
                      Returned to Investigative Agency for correction
                    </label>
                  </div>
                  <div className="govuk-radios__item">
                    <input
                      className="govuk-radios__input"
                      id="over-reason-colleague"
                      name="over-reason"
                      type="radio"
                      value="colleague"
                    />
                    <label
                      className="govuk-label govuk-radios__label"
                      htmlFor="over-reason-colleague"
                    >
                      Returned to CPS colleague for correction
                    </label>
                  </div>
                </div>

                <RedactionTypesGrid
                  selected={selectedTypes}
                  onToggle={toggleType}
                />
              </div>
            )}
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
