import { useEffect, useState, ChangeEvent, KeyboardEvent } from 'react';

export type Props = {
  id: string;
  onChange?: (query: string) => void;
  onSearch?: (query: string) => void;
  hideButton?: boolean;
  label: string;
  placeholder: string;
  defaultValue?: string;
};

export const SearchInput = ({
  id,
  defaultValue,
  onChange,
  onSearch,
  hideButton = true,
  label,
  placeholder
}: Props) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchClick = () => {
    if (onSearch) onSearch(searchTerm);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setSearchTerm(value);
    if (onChange) onChange(value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearchClick();
    }
  };

  useEffect(() => {
    if (defaultValue !== searchTerm) {
      setSearchTerm(defaultValue || '');
    }
  }, [defaultValue]);

  return (
    <div className="searchForm">
      <label className="govuk-label--s govuk-label" htmlFor={id}>
        {label}
      </label>
      <div className="search-form-container">
        <input
          className="govuk-input"
          id={id}
          name={id}
          type="search"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />

        {!hideButton && (
          <button
            type="submit"
            className="govuk-button search-button"
            data-module="govuk-button"
            onClick={handleSearchClick}
          >
            Search
          </button>
        )}
      </div>
    </div>
  );
};
