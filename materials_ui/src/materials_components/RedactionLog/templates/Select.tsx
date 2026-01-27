import styles from '../RedactionLogModal.module.scss';

type Option = { id: string; name: string };

type SelectDropdownProps = {
  label: string;
  id: string;
  name: string;
  options: Option[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const SelectDropdown = ({
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
