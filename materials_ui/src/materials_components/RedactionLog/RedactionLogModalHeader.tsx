import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { TLookupsResponse } from '../../caseWorkApp/types/redaction';
import { RedactionLogFormInputs } from './RedactionLogModal';
import styles from './RedactionLogModal.module.scss';
import { SelectDropdown } from './templates/Select';

type RedactionLogModalHeaderProps = { urn: string; lookups?: TLookupsResponse };

export const RedactionLogModalHeader = ({
  urn,
  lookups
}: RedactionLogModalHeaderProps) => {
  const areas = lookups?.areas || [];
  const divisions = lookups?.divisions || [];
  const investigatingAgencies = lookups?.investigatingAgencies || [];

  // Temp data for charge statuses
  const chargeStatuses = [
    { id: 'Pre-charge', name: 'Pre-charge' },
    { id: 'Post-charge', name: 'Post-charge' }
  ];

  const areasAndDivisions = [...areas, ...divisions];
  const [selectedId, setSelectedId] = useState<string>('');
  const selectedItem = areasAndDivisions.find((item) => item.id === selectedId);

  const {
    control,
    setValue,
    formState: { errors }
  } = useFormContext<RedactionLogFormInputs>();

  if (errors.areasAndDivisionsId) {
    errors.areasAndDivisionsId.message =
      'Please enter valid CPS Area or Central Casework Division';
  }
  if (errors.businessUnitId) {
    errors.businessUnitId.message = 'Please enter valid CPS Business Unit';
  }

  return (
    <div className={styles.modalHeader}>
      <h1 className="govuk-heading-l">{urn} - Redaction Log</h1>

      <div
        className="govuk-form-group"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
          alignItems: 'flex-end',
          gap: '20px',
          width: '100%',
          maxWidth: '100%',
          marginBottom: '0'
        }}
      >
        <Controller
          name="areasAndDivisionsId"
          control={control}
          rules={{
            required: true,
            validate: (v) =>
              v !== '' || 'Select a CPS Area or Central Casework Division'
          }}
          render={({ field }) => (
            <SelectDropdown
              label="CPS Area or Central Casework Division: "
              id="areasAndDivisions-select"
              name={field.name}
              options={areasAndDivisions}
              value={field.value}
              onChange={(e) => {
                field.onChange(e.target.value);
                setSelectedId(e.target.value);
                setValue('businessUnitId', '');
              }}
              error={
                errors.areasAndDivisionsId
                  ? 'Select an Area or Division'
                  : undefined
              }
            />
          )}
        />

        <Controller
          name="businessUnitId"
          control={control}
          rules={{
            required: true,
            validate: (v) => v !== '' || 'Select a CPS Business Unit'
          }}
          render={({ field }) => (
            <SelectDropdown
              label="CPS Business Unit: "
              id="unified-child-select"
              name={field.name}
              options={selectedItem?.children || []}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              error={
                errors.businessUnitId ? 'Select a Business Unit' : undefined
              }
            />
          )}
        />

        <Controller
          name="investigatingAgencyId"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <SelectDropdown
              label="Investigative Agency: "
              id="investigating-agency-select"
              name={field.name}
              options={investigatingAgencies}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />

        <Controller
          name="chargeStatus"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <SelectDropdown
              label="Charge Status: "
              id="charge-status-select"
              name={field.name}
              options={chargeStatuses}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
        <Controller
          name="documentTypeId"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <SelectDropdown
              label="Document Type: "
              id="document-type-select"
              name={field.name}
              options={lookups?.documentTypes || []}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
      </div>
    </div>
  );
};
