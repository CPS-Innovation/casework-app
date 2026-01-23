import { useState } from 'react';
import { TLookupsResponse } from '../../caseWorkApp/types/redaction';
import styles from './RedactionLogModal.module.scss';
type Option = { id: string; name: string };

type SelectDropdownProps = {
  label: string;
  id: string;
  name: string;
  options: Option[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const SelectDropdown = ({
  label,
  id,
  name,
  options,
  value,
  onChange
}: SelectDropdownProps) => (
  <div className={styles.selectWrapper}>
    <label className="govuk-label" htmlFor={id}>
      {label}
    </label>
    <select
      className="govuk-select"
      id={id}
      name={name}
      value={value}
      onChange={onChange}
    >
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  </div>
);

type RedactionLogModalHeaderProps = { urn: string; lookups?: TLookupsResponse };

export const RedactionLogModalHeader = ({
  urn,
  lookups
}: RedactionLogModalHeaderProps) => {
  const areas = lookups?.areas || [];
  const divisions = lookups?.divisions || [];
  const investigatingAgencies = lookups?.investigatingAgencies || [];

  const unified = [...areas, ...divisions];
  const [selectedId, setSelectedId] = useState<string>(unified[0]?.id || '');
  const selectedItem = unified.find((item) => item.id === selectedId);

  return (
    <div className={styles.modalHeader}>
      <h1>{urn} - Redaction Log</h1>

      <div
        className="govuk-form-group"
        style={{ display: 'flex', gap: '20px', maxWidth: 'fit-content' }}
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
          label="Document Type: "
          id="document-type-select"
          name="document-type-select"
          options={lookups?.documentTypes || []}
        />
      </div>
    </div>
  );
};
