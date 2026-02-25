import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  postRedactionLog,
  useAxiosInstance
} from '../../caseWorkApp/components/utils/getData';
import { TLookupsResponse } from '../../caseWorkApp/types/redaction';
import { TDocument } from '../DocumentSelectAccordion/getters/getDocumentList';
import { TRedactionType } from '../PdfRedactor/PdfRedactionTypeForm';
import { TRedaction } from '../PdfRedactor/utils/coordUtils';
import { Modal } from './Modal';
import styles from './RedactionLogModal.module.scss';
import { RedactionLogModalBody } from './RedactionLogModalBody';
import { RedactionLogModalHeader } from './RedactionLogModalHeader';
import { transformFormDataToApiFormat } from './utils/transformFormData';

export type RedactionLogFormInputs = {
  underRedactionSelected: boolean;
  overRedactionSelected: boolean;

  underRedactionTypeIds: number[];
  overRedactionTypeIds: number[];

  areasAndDivisionsId: string;
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
  selectedRedactionTypes?: TRedactionType[];
};

export const RedactionLogModal = ({
  urn,
  activeDocument,
  isOpen,
  onClose,
  lookups,
  mode,
  redactions,
  selectedRedactionTypes
}: RedactionLogModalProps) => {
  const policeCode = urn.substring(0, 2);

  const existingInvestigatingAgencyId = lookups?.ouCodeMapping.find(
    (ia) => ia.ouCode === policeCode
  )?.investigatingAgencyCode;

  const axiosInstance = useAxiosInstance();
  const form = useForm<RedactionLogFormInputs>({
    defaultValues: {
      underRedactionSelected: false,
      overRedactionSelected: false,
      underRedactionTypeIds: [],
      overRedactionTypeIds: [],

      overReason: null,
      areasAndDivisionsId: '',
      businessUnitId: '',
      investigatingAgencyId: '',
      chargeStatus: 'Pre-charge',
      documentTypeId: '',
      supportingNotes: ''
    }
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        underRedactionSelected: false,
        overRedactionSelected: false,
        underRedactionTypeIds: [],
        overRedactionTypeIds: [],

        overReason: null,
        areasAndDivisionsId: '',
        businessUnitId: '',
        investigatingAgencyId: existingInvestigatingAgencyId || '',
        chargeStatus: 'Pre-charge',
        documentTypeId: activeDocument?.cmsDocType.documentTypeId || '',
        supportingNotes: ''
      });
    }
  }, [isOpen, existingInvestigatingAgencyId, activeDocument, form]);

  const onSubmit = async (values: RedactionLogFormInputs) => {
    try {
      const apiData = transformFormDataToApiFormat(
        values,
        urn,
        activeDocument,
        lookups
      );
      console.log('Submitting redaction log:', apiData);

      await postRedactionLog({ axiosInstance, data: apiData });

      console.log('Redaction log submitted successfully');
      onClose();
    } catch (error) {
      console.error('Failed to submit redaction log:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <RedactionLogModalHeader urn={urn} lookups={lookups} />
          <RedactionLogModalBody
            activeDocument={activeDocument}
            mode={mode}
            redactions={redactions}
            selectedRedactionTypes={selectedRedactionTypes}
            lookups={lookups}
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
