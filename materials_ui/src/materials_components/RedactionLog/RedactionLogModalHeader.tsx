import { useState } from 'react';
import { TLookupsResponse } from '../../caseWorkApp/types/redaction';
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

  const unified = [...areas, ...divisions];
  const [selectedId, setSelectedId] = useState<string>(unified[0]?.id || '');
  const selectedItem = unified.find((item) => item.id === selectedId);

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
          maxWidth: '100%'
        }}
      >
        <SelectDropdown
          label="CPS Area or Central Casework Division: "
          id="unified-select"
          name="unified-select"
          options={unified}
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        />
        <SelectDropdown
          label="CPS Business Unit: "
          id="unified-child-select"
          name="unified-child-select"
          options={selectedItem?.children || []}
        />
        <SelectDropdown
          label="Investigative Agency: "
          id="investigating-agency-select"
          name="investigating-agency-select"
          options={investigatingAgencies}
        />
        <SelectDropdown
          label="Charge Status: "
          id="charge-status-select"
          name="charge-status-select"
          options={chargeStatuses}
        />
        <SelectDropdown
          label="Document Type: "
          id="document-type-select"
          name="document-type-select"
          options={lookups?.documentTypes || []}
        />
      </div>
    </div>
  );
};
