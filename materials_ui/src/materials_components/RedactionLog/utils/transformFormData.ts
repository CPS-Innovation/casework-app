import { TLookupsResponse } from '../../../caseWorkApp/types/redaction';
import { RedactionLogData } from '../../../caseWorkApp/types/redactionLog';
import { TDocument } from '../../DocumentSelectAccordion/getters/getDocumentList';
import { RedactionLogFormInputs } from '../RedactionLogModal';

// Helper function to find area/division and unit data
const findAreaAndUnit = (
  lookups: TLookupsResponse,
  areaId: string,
  unitId: string
) => {
  // Search in areas first
  for (const area of lookups.areas || []) {
    if (
      area.id === areaId ||
      area.children?.some((child) => child.id === unitId)
    ) {
      const unit = area.children?.find((child) => child.id === unitId);
      return { area, unit };
    }
  }

  // Then search in divisions
  for (const division of lookups.divisions || []) {
    if (
      division.id === areaId ||
      division.children?.some((child) => child.id === unitId)
    ) {
      const unit = division.children?.find((child) => child.id === unitId);
      return { area: division, unit };
    }
  }

  return { area: null, unit: null };
};

// Helper function to create redactions array
const createRedactionsArray = (
  lookups: TLookupsResponse,
  underRedactionTypeIds: number[],
  overRedactionTypeIds: number[],
  overReason: 'investigative-agency' | 'cps-colleague' | null
): RedactionLogData['redactions'] => {
  const redactionsArray: RedactionLogData['redactions'] = [];
  const isReturnedToIA = overReason === 'investigative-agency';

  // Add under redactions (redactionType: 1)
  underRedactionTypeIds.forEach((typeId) => {
    const redactionType = lookups.missedRedactions?.find(
      (rt) => parseInt(rt.id) === typeId
    );
    if (redactionType) {
      redactionsArray.push({
        missedRedaction: { id: redactionType.id, name: redactionType.name },
        redactionType: 1,
        returnedToInvestigativeAuthority: isReturnedToIA
      });
    }
  });

  // Add over redactions (redactionType: 2)
  overRedactionTypeIds.forEach((typeId) => {
    const redactionType = lookups.missedRedactions?.find(
      (rt) => parseInt(rt.id) === typeId
    );
    if (redactionType) {
      redactionsArray.push({
        missedRedaction: { id: redactionType.id, name: redactionType.name },
        redactionType: 2,
        returnedToInvestigativeAuthority: isReturnedToIA
      });
    }
  });

  return redactionsArray;
};

// Main transformation function
export const transformFormDataToApiFormat = (
  formData: RedactionLogFormInputs,
  urn: string,
  activeDocument: TDocument | null | undefined,
  lookups: TLookupsResponse | undefined
): RedactionLogData => {
  if (!lookups) {
    throw new Error('Lookups data is required for form transformation');
  }

  // Find area/division and unit
  const { area, unit } = findAreaAndUnit(
    lookups,
    formData.areasAndDivisionsId,
    formData.businessUnitId
  );

  // Find other lookup items
  const investigatingAgency = lookups.investigatingAgencies?.find(
    (ia) => ia.id === formData.investigatingAgencyId
  );

  const documentType = lookups.documentTypes?.find(
    (dt) => dt.id.toString() === formData.documentTypeId.toString()
  );

  // Create redactions array
  const redactions = createRedactionsArray(
    lookups,
    formData.underRedactionTypeIds,
    formData.overRedactionTypeIds,
    formData.overReason
  );

  return {
    urn,
    unit: {
      id: unit?.id || formData.businessUnitId,
      type: 'Area',
      areaDivisionName: area?.name || '',
      name: unit?.name || ''
    },
    investigatingAgency: {
      id: investigatingAgency?.id || formData.investigatingAgencyId,
      name: investigatingAgency?.name || ''
    },
    documentType: {
      id: documentType?.id.toString() || formData.documentTypeId.toString(),
      name: documentType?.name || ''
    },
    redactions,
    notes: formData.supportingNotes,
    chargeStatus: formData.chargeStatus === 'Pre-charge' ? 1 : 2,
    cmsValues: {
      originalFileName: activeDocument?.cmsOriginalFileName || '',
      documentId: activeDocument?.documentId || 0,
      documentType: activeDocument?.cmsDocType?.documentType || '',
      fileCreatedDate:
        activeDocument?.cmsFileCreatedDate || new Date().toISOString(),
      documentTypeId: activeDocument?.cmsDocType?.documentTypeId || 0
    }
  };
};
