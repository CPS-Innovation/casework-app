import { Controller, useFormContext } from 'react-hook-form';
import { TDocument } from '../DocumentSelectAccordion/getters/getDocumentList';
import { TRedaction } from '../PdfRedactor/utils/coordUtils';
import styles from './RedactionLogModal.module.scss';
import { Checkbox } from './templates/Checkbox';
import { ErrorSummary } from './templates/ErrorSummary';

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

type RedactionLogModalBodyProps = {
  activeDocument?: TDocument | null;
  mode?: Mode;
  redactions?: TRedaction[];
};

export type RedactionLogFormValues = {
  underRedactionSelected: boolean;
  overRedactionSelected: boolean;

  underRedactionTypeIds: number[];
  overRedactionTypeIds: number[];

  overReason: 'investigative-agency' | 'cps-colleague' | null;
  supportingNotes: string;
};

const RedactionTypesGrid = ({
  value,
  onChange
}: {
  value: number[];
  onChange: (next: number[]) => void;
}) => {
  const selected = new Set(value);

  const onToggle = (id: number) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    onChange(Array.from(next));
  };

  return (
    <div
      className="govuk-checkboxes"
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
          key={`${type.id}`}
          id={`redaction-type-${type.id}`}
          label={type.name}
          checked={selected.has(type.id)}
          onChange={() => onToggle(type.id)}
          isSmall
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
  const {
    control,
    register,
    watch,
    formState: { errors }
  } = useFormContext<RedactionLogFormValues>();

  const underRedactionSelected = watch('underRedactionSelected');
  const overRedactionSelected = watch('overRedactionSelected');

  console.log(errors);

  return (
    <div className={styles.modalBody}>
      <ErrorSummary errors={errors} />

      <h2>Redaction details for: {activeDocument?.presentationTitle}</h2>

      {mode === 'over-under' && (
        <div
          className={
            `govuk-form-group` +
            (!underRedactionSelected && !overRedactionSelected
              ? ' govuk-form-group--error'
              : '')
          }
        >
          <fieldset className="govuk-fieldset">
            <legend className="govuk-fieldset__legend">
              Confirm the redaction type
            </legend>

            {!underRedactionSelected && !overRedactionSelected && (
              <p className="govuk-error-message">Select a redaction category</p>
            )}
            {underRedactionSelected && errors.underRedactionSelected && (
              <p className="govuk-error-message">
                {errors.underRedactionSelected.message}
              </p>
            )}
            {overRedactionSelected && errors.overRedactionSelected && (
              <p className="govuk-error-message">
                {errors.overRedactionSelected.message}
              </p>
            )}

            <Controller
              name="underRedactionSelected"
              control={control}
              rules={{ required: 'Select a redaction category' }}
              render={({ field }) => (
                <Checkbox
                  id="under-redaction"
                  label="Under Redaction"
                  hint="Returned to Investigative Agency for correction"
                  checked={!!field.value}
                  onChange={() => field.onChange(!field.value)}
                />
              )}
            />

            {underRedactionSelected && (
              <div
                className="govuk-checkboxes__conditional"
                id="conditional-under-redaction"
                style={{ marginTop: 8 }}
              >
                <div
                  className={`govuk-form-group ${errors.underRedactionTypeIds ? 'govuk-form-group--error' : ''}`}
                >
                  <Controller
                    name="underRedactionTypeIds"
                    control={control}
                    rules={{
                      validate: (arr) => {
                        !underRedactionSelected ||
                          (arr && arr.length > 0) ||
                          'Select at least one redaction type';
                      }
                    }}
                    render={({ field }) => (
                      <>
                        {errors.underRedactionTypeIds && (
                          <p className="govuk-error-message">
                            {errors.underRedactionTypeIds.message}
                          </p>
                        )}

                        <legend className="govuk-fieldset__legend">
                          Types of redaction
                        </legend>
                        <RedactionTypesGrid
                          value={field.value ?? []}
                          onChange={field.onChange}
                        />
                      </>
                    )}
                  />
                </div>
              </div>
            )}

            <Controller
              name="overRedactionSelected"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="over-redaction"
                  label="Over Redaction"
                  checked={!!field.value}
                  onChange={() => field.onChange(!field.value)}
                />
              )}
            />

            {overRedactionSelected && (
              <div
                className="govuk-checkboxes__conditional"
                id="conditional-over-redaction"
                style={{ marginTop: 8 }}
              >
                <div
                  className={`govuk-form-group ${errors.overReason?.message ? 'govuk-form-group--error' : ''}`}
                >
                  {errors.overReason?.message && (
                    <p className="govuk-error-message">
                      {errors.overReason?.message}
                    </p>
                  )}
                  <Controller
                    name="overReason"
                    control={control}
                    rules={{
                      validate: (value) => {
                        overRedactionSelected ||
                          value ||
                          'Select a reason for over redaction';
                      }
                    }}
                    render={({ field }) => (
                      <div
                        className="govuk-radios govuk-radios--small"
                        data-module="govuk-radios"
                      >
                        <div className="govuk-radios__item">
                          <input
                            className="govuk-radios__input"
                            id="over-reason-ia"
                            name={field.name}
                            type="radio"
                            value="investigative-agency"
                            checked={field.value === 'investigative-agency'}
                            onChange={(e) => field.onChange(e.target.value)}
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
                            name={field.name}
                            type="radio"
                            value="cps-colleague"
                            checked={field.value === 'cps-colleague'}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                          <label
                            className="govuk-label govuk-radios__label"
                            htmlFor="over-reason-colleague"
                          >
                            Returned to CPS colleague for correction
                          </label>
                        </div>
                      </div>
                    )}
                  />
                </div>
                <div
                  className={`govuk-form-group ${errors.overRedactionTypeIds ? 'govuk-form-group--error' : ''}`}
                >
                  <Controller
                    name="overRedactionTypeIds"
                    control={control}
                    rules={{
                      validate: (arr) => {
                        !overRedactionSelected ||
                          (arr && arr.length > 0) ||
                          'Select at least one redaction type';
                      }
                    }}
                    render={({ field }) => (
                      <>
                        <legend className="govuk-fieldset__legend">
                          Types of redaction
                        </legend>
                        <RedactionTypesGrid
                          value={field.value ?? []}
                          onChange={field.onChange}
                        />
                      </>
                    )}
                  />
                </div>
              </div>
            )}
          </fieldset>
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

      <div
        className={`govuk-form-group ${errors.supportingNotes ? 'govuk-form-group--error' : ''} govuk-!-margin-bottom-0`}
      >
        <label className="govuk-label" htmlFor="supportingNotes">
          Supporting notes (optional)
        </label>

        {errors.supportingNotes && (
          <p className="govuk-error-message">
            {errors.supportingNotes.message}
          </p>
        )}

        <textarea
          className="govuk-textarea"
          id="supportingNotes"
          rows={5}
          style={{ width: '50%' }}
          {...register('supportingNotes', {
            maxLength: {
              value: 400,
              message: 'Supporting notes cannot exceed 400 characters'
            }
          })}
        />

        <p className="govuk-body">You have 400 characters remaining</p>
      </div>
    </div>
  );
};
