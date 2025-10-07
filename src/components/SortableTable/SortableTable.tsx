// @ts-nocheck
import { Fragment, memo, ReactNode, useContext } from 'react';
import { FilterItem } from '../../context/FiltersContext/helpers/types';
import { SelectedItemsContext } from '../../context/SelectedItemsContext';
import { useAutoReclassify, useCaseMaterial, useFilters } from '../../hooks';
import {
  CaseMaterialDataType,
  CaseMaterialsResponseType,
  CaseMaterialsType
} from '../../schemas/caseMaterials';
import Checkbox from '../Checkbox/Checkbox';
import DocumentActions from '../DocumentPreview/DocumentActions';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import './SortableTable.scss';

export type Column<T> = {
  key: string;
  heading: string | ReactNode;
  render?: (row: T) => ReactNode;
  isSortable?: boolean;
};

type SortableTableProps = {
  data: CaseMaterialsType[];
  caption: string;
  filters?: FilterItem;
  columns: Column[];
  expandableRow?: (row: T) => ReactNode;
  dataName: CaseMaterialDataType;
  checkboxes?: boolean;
  error: T;
};

const SortableTable = memo(
  ({
    data,
    filters,
    columns,
    expandableRow,
    caption,
    dataName,
    checkboxes = true,
    error
  }: SortableTableProps) => {
    const { isPending: isAutoReclassifyPending } = useAutoReclassify();
    const { setSort } = useFilters(dataName);
    const { selectedItems, setSelectedItems } =
      useContext(SelectedItemsContext);
    const { selectedMaterialId, selectMaterial, deselectMaterial } =
      useCaseMaterial();

    const handleSelectItem = (material: CaseMaterialsType) => {
      const isSelected = selectedItems.some(
        (m) => m.materialId === material.materialId
      );

      if (isSelected) {
        setSelectedItems(
          selectedItems.filter((m) => m.materialId !== material.materialId)
        );
      } else {
        setSelectedItems([...selectedItems, material]);
      }
    };

    const handleSelectAll = (event) => {
      if (event.target.checked) {
        setSelectedItems([...data]);
      } else {
        setSelectedItems([]);
      }
    };

    const handleActionsClick = (materialId: number | null) => {
      if (materialId) {
        selectMaterial(materialId);
      } else {
        deselectMaterial();
      }
    };

    if (isAutoReclassifyPending) {
      return <LoadingSpinner textContent={`Reclassifying ${dataName}...`} />;
    }

    return (
      <div className="table-container">
        <table className="govuk-table">
          <caption className="govuk-visually-hidden">{caption}</caption>
          <thead className="govuk-table__head">
            <tr className="govuk-table__row">
              {checkboxes && (
                <th className="govuk-table__header">
                  <Checkbox
                    id="select-all"
                    aria-label="Select all case materials"
                    label="Select All"
                    labelVisuallyHidden={true}
                    onChange={handleSelectAll}
                    checked={
                      selectedItems?.length === data.length && data?.length > 0
                    }
                  />
                </th>
              )}
              {columns?.length &&
                columns?.map(({ key, heading, isSortable }) => (
                  <th
                    key={key}
                    scope="col"
                    className="govuk-table__header"
                    aria-sort={
                      filters?.sort?.column === key
                        ? filters?.sort.direction
                        : 'none'
                    }
                  >
                    {isSortable ? (
                      <button
                        type="button"
                        className="sortable-table-header-button"
                        onClick={() => setSort(key)}
                        aria-label={`Sort ${heading} by ${
                          filters?.sort?.direction
                        } order`}
                      >
                        {heading}
                      </button>
                    ) : (
                      heading
                    )}
                  </th>
                ))}
              <td className="govuk-table__header" style={{ width: '10%' }}></td>
            </tr>
          </thead>

          <tbody className="govuk-table__body">
            {data?.length > 0 ? (
              data?.map((row: CaseMaterialsResponseType, index) => {
                const isCurrentMaterial =
                  +selectedMaterialId === row.materialId;

                return (
                  <Fragment key={index}>
                    <tr key={index} className="govuk-table__row">
                      {checkboxes && (
                        <td className="govuk-table__cell">
                          <Checkbox
                            id={`select-${row.subject}`}
                            label={`Select ${row.subject}`}
                            checked={selectedItems.some((m) => m.id === row.id)}
                            onChange={() => handleSelectItem(row)}
                            labelVisuallyHidden={true}
                          />
                        </td>
                      )}
                      {columns.map((col, colIndex) => (
                        <td key={colIndex} className="govuk-table__cell">
                          {col.render ? col.render(row) : row[col.key]}
                        </td>
                      ))}
                      <td
                        className="govuk-table__cell"
                        style={{ textAlign: 'right' }}
                      >
                        <DocumentActions
                          label={row.subject}
                          isOpen={isCurrentMaterial}
                          onDocumentOpen={() =>
                            handleActionsClick(
                              isCurrentMaterial ? null : row.materialId
                            )
                          }
                        />
                      </td>
                    </tr>

                    {expandableRow && isCurrentMaterial && (
                      <tr>
                        <td className="govuk-table__cell" colSpan={8}>
                          {expandableRow(row)}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            ) : error ? (
              <tr>
                <td colSpan={8}>
                  <p className="govuk-body no-materials-message">
                    Unable to fetch {dataName} for this case
                  </p>
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={8}>
                  <p className="govuk-body no-materials-message">
                    There are no {dataName} that match your selection for this
                    case
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
);

export default SortableTable;
