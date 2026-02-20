import { FormProvider, useForm } from 'react-hook-form';
import {
  postRedactionLog,
  RedactionLogData,
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
      investigatingAgencyId: existingInvestigatingAgencyId || '',
      chargeStatus: 'Pre-charge',
      documentTypeId: activeDocument?.cmsDocType.documentTypeId || '',
      supportingNotes: ''
    }
  });

  const transformFormDataToApiFormat = (
    formData: RedactionLogFormInputs
  ): RedactionLogData => {
    // Find area and business unit from lookups structure
    let areaData = null;
    let unitData = null;

    // Search in areas
    for (const area of lookups?.areas || []) {
      if (area.id === formData.areasAndDivisionsId) {
        areaData = area;
        unitData = area.children?.find(
          (child) => child.id === formData.businessUnitId
        );
        break;
      }
      // Also check if business unit is in this area's children
      const foundUnit = area.children?.find(
        (child) => child.id === formData.businessUnitId
      );
      if (foundUnit && !unitData) {
        areaData = area;
        unitData = foundUnit;
      }
    }

    // Search in divisions if not found in areas
    if (!areaData) {
      for (const division of lookups?.divisions || []) {
        if (division.id === formData.areasAndDivisionsId) {
          areaData = division;
          unitData = division.children?.find(
            (child) => child.id === formData.businessUnitId
          );
          break;
        }
        // Also check if business unit is in this division's children
        const foundUnit = division.children?.find(
          (child) => child.id === formData.businessUnitId
        );
        if (foundUnit && !unitData) {
          areaData = division;
          unitData = foundUnit;
        }
      }
    }

    const investigatingAgency = lookups?.investigatingAgencies.find(
      (ia) => ia.id === formData.investigatingAgencyId
    );
    const docType = lookups?.documentTypes.find(
      (dt) => dt.id.toString() === formData.documentTypeId.toString()
    );

    // Build redactions array
    const redactionsArray: RedactionLogData['redactions'] = [];

    // Add under redactions (redactionType: 1)
    formData.underRedactionTypeIds.forEach((typeId) => {
      const redactionType = lookups?.missedRedactions.find(
        (rt) => parseInt(rt.id) === typeId
      );
      if (redactionType) {
        redactionsArray.push({
          missedRedaction: { id: redactionType.id, name: redactionType.name },
          redactionType: 1, // Under redaction
          returnedToInvestigativeAuthority:
            formData.overReason === 'investigative-agency'
        });
      }
    });

    // Add over redactions (redactionType: 2)
    formData.overRedactionTypeIds.forEach((typeId) => {
      const redactionType = lookups?.missedRedactions.find(
        (rt) => parseInt(rt.id) === typeId
      );
      if (redactionType) {
        redactionsArray.push({
          missedRedaction: { id: redactionType.id, name: redactionType.name },
          redactionType: 2, // Over redaction
          returnedToInvestigativeAuthority:
            formData.overReason === 'investigative-agency'
        });
      }
    });

    return {
      urn,
      unit: {
        id: unitData?.id || formData.businessUnitId,
        type: 'Area', // This might need to come from lookup data
        areaDivisionName: areaData?.name || '',
        name: unitData?.name || ''
      },
      investigatingAgency: {
        id: investigatingAgency?.id || formData.investigatingAgencyId,
        name: investigatingAgency?.name || ''
      },
      documentType: {
        id: docType?.id.toString() || formData.documentTypeId.toString(),
        name: docType?.name || ''
      },
      redactions: redactionsArray,
      notes: formData.supportingNotes,
      chargeStatus: formData.chargeStatus === 'Pre-charge' ? 1 : 2,
      cmsValues: {
        originalFileName: activeDocument?.cmsOriginalFileName || '',
        documentId: activeDocument?.documentId || 0,
        documentType: activeDocument?.cmsDocType.documentType || '',
        fileCreatedDate:
          activeDocument?.cmsFileCreatedDate || new Date().toISOString(),
        documentTypeId: activeDocument?.cmsDocType.documentTypeId || 0
      }
    };
  };

  const onSubmit = async (values: RedactionLogFormInputs) => {
    try {
      const apiData = transformFormDataToApiFormat(values);
      console.log('Submitting redaction log:', apiData);

      await postRedactionLog({ axiosInstance, data: apiData });

      console.log('Redaction log submitted successfully');
      onClose();
    } catch (error) {
      console.error('Failed to submit redaction log:', error);
      // You might want to show an error message to the user here
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
