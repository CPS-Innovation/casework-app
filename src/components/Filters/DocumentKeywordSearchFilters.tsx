import { ChangeEvent } from 'react';
import { useDocuments, useFilters } from '../../hooks';
import { categoriseDocument } from '../../packages/DocumentSelectAccordion/utils/categoriseDocument';
import {
  categoryDetails,
  initDocsOnDocCategoryNamesMap
} from '../../packages/DocumentSelectAccordion/utils/categoriseDocumentHelperUtils';
import Checkbox from '../Checkbox/Checkbox';

export const DocumentKeywordSearchFilters = () => {
  const {
    resetFilters,
    shallowFilters,
    setCheckboxFilter,
    saveFiltersToContext
  } = useFilters('materials');

  const { docTypes, documents } = useDocuments();

  const handleCheckboxChange = (
    filterGroup: string,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { checked, value } = event.target;

    setCheckboxFilter(filterGroup, value, checked);
  };

  const handleFiltersSubmit = () => {
    saveFiltersToContext();
  };

  const docsOnDocCategoryNames = initDocsOnDocCategoryNamesMap();

  documents?.forEach((doc) => {
    const categoryName = categoriseDocument(doc);
    docsOnDocCategoryNames[categoryName].push(doc);
  });

  const categoriesList = categoryDetails.map((category) => ({
    key: category.label,
    label: category.label,
    documents: docsOnDocCategoryNames[category.categoryName]
  }));

  return (
    <div className="filters-container" id="filters">
      <div
        style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}
      >
        <h2 className="govuk-heading-m" style={{ marginBottom: '0px' }}>
          Filters
        </h2>

        <a
          href="#"
          className="govuk-link link"
          onClick={(event) => {
            event.preventDefault();
            resetFilters();
          }}
          style={{ fontSize: '19px' }}
          aria-label="Clear filters"
        >
          Clear filters
        </a>
      </div>

      <div className="govuk-form-group">
        <fieldset className="govuk-fieldset">
          <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
            <h3 className="govuk-heading-s small-heading-spacing">
              Document type
            </h3>
          </legend>
          {docTypes.map((type) => (
            <Checkbox
              id={`documentType-${type}`}
              label={type}
              checked={
                shallowFilters?.filters?.documentType?.includes(type) || false
              }
              onChange={(event) => handleCheckboxChange('documentType', event)}
              value={type}
              key={type}
            />
          ))}
        </fieldset>
      </div>

      <div className="govuk-form-group">
        <fieldset className="govuk-fieldset">
          <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
            <h3 className="govuk-heading-s small-heading-spacing">Category</h3>
          </legend>

          {categoriesList.map((category) => (
            <Checkbox
              id={`category-${category.key}`}
              label={`${category.label} (${category.documents.length})`}
              checked={
                shallowFilters?.filters?.category?.includes(category.key) ||
                false
              }
              onChange={(event) => handleCheckboxChange('category', event)}
              value={category.key}
              key={category.key}
            />
          ))}
        </fieldset>
      </div>

      <div
        style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}
      >
        <button
          type="submit"
          className="govuk-button"
          data-module="govuk-button"
          onClick={handleFiltersSubmit}
          data-testid="applyFiltersButton"
        >
          Apply filters
        </button>

        <a
          href="#"
          className="govuk-link link"
          onClick={(event) => {
            event.preventDefault();
            resetFilters();
          }}
          style={{ fontSize: '19px', textAlign: 'right' }}
          aria-label="Clear filters"
        >
          Clear filters
        </a>
      </div>
    </div>
  );
};
