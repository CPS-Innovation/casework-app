import { FormProvider, useForm } from 'react-hook-form';
import { TLookupsResponse } from '../../caseWorkApp/types/redaction';
import { TDocument } from '../DocumentSelectAccordion/getters/getDocumentList';
import { TRedaction } from '../PdfRedactor/utils/coordUtils';
import { Modal } from './Modal';
import styles from './RedactionLogModal.module.scss';
import { RedactionLogModalBody } from './RedactionLogModalBody';
import { RedactionLogModalHeader } from './RedactionLogModalHeader';

export type RedactionLogFormInputs = {
  underRedactionSelected: boolean;
  overRedactionSelected: boolean;

  underRedactionTypeIds: number[];
  overRedactionTypeIds: number[];

  unifiedId: string;
  businessUnitId: string;
  investigatingAgencyId: string;
  chargeStatus: 'Pre-charge' | 'Post-charge';
  documentTypeId: string | number;

  category: 'under' | 'over' | null;
  overReason: 'investigative-agency' | 'cps-colleague' | null;
  redactionTypes: number[];
  supportingNotes: string;
};

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
  const unified = [...(lookups?.areas ?? []), ...(lookups?.divisions ?? [])];

  const form = useForm<RedactionLogFormInputs>({
    defaultValues: {
      underRedactionSelected: false,
      overRedactionSelected: false,
      underRedactionTypeIds: [],
      overRedactionTypeIds: [],

      overReason: null,
      unifiedId: unified[0]?.id || '',
      businessUnitId: '',
      investigatingAgencyId: '',
      chargeStatus: 'Pre-charge',
      documentTypeId: activeDocument?.cmsDocType.documentTypeId || '',
      supportingNotes: ''
    }
  });

  const onSubmit = (values: RedactionLogFormInputs) => {
    console.log('Form submitted with values:', values);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(() => onSubmit(form.getValues()))}
          noValidate
        >
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
                data-testid="saveChangesButton"
                disabled={form.formState.isSubmitting}
              >
                Save and close
              </button>
              <button
                onClick={onClose}
                type="button"
                className="govuk-button govuk-button--secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
