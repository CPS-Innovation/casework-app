import { useContext, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  useCaseMaterials,
  useFeatureFlag,
  useFilters,
  usePager
} from '../../hooks';

import { CaseMaterialsType } from '../../schemas';
import {
  defaultFilterFn,
  defaultSearchFn,
  defaultSortFn
} from '../../utils/filtering';

import SortableTable, { Column } from './SortableTable';

import { DEFAULT_RESULTS_PER_PAGE } from '../../constants/query';
import { Pagination } from '../Pagination/Pagination';

import { READ_STATUS } from '../../constants';
import { ReclassificationContext } from '../../context/ReclassificationContext';
import { formatDate } from '../../utils/date.ts';
import DocumentPreview from '../DocumentPreview/DocumentPreview';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { StatusTag } from '../StatusTag/StatusTag.tsx';

type Props = {
  renamedMaterialId: number | null;
  setRenamedMaterialId?: (id: number | null) => void;
};

export const CommunicationsTable = ({ renamedMaterialId }: Props) => {
  const hasAccess = useFeatureFlag();

  const [queryParams] = useSearchParams();
  const {
    filteredData,
    loading: caseMaterialsLoading,
    error
  } = useCaseMaterials('communications');

  const { filters } = useFilters('communications');

  // @ts-ignore
  const { reclassifiedMaterialIds } = useContext(ReclassificationContext);
  // @ts-ignore
  const filteredSortedData = useMemo(() => {
    const sortFn = defaultSortFn<CaseMaterialsType>(filters?.sort);
    const sortByStatusFn = defaultSortFn<CaseMaterialsType>({
      column: 'statusLabel',
      direction: 'descending'
    });
    const filterFn = defaultFilterFn<CaseMaterialsType>(filters?.filters);
    const searchFn = defaultSearchFn<CaseMaterialsType>(
      'subject',
      filters?.search
    );

    return filteredData
      ?.map((material) => {
        if (reclassifiedMaterialIds.includes(material.materialId))
          return { ...material, statusLabel: 'Reclassified' };
        if (renamedMaterialId && [+renamedMaterialId].includes(material?.id))
          return { ...material, statusLabel: 'Renamed' };

        return material;
      })
      ?.filter(searchFn)
      ?.filter(filterFn)
      ?.sort((a, b) => {
        if (
          a.readStatus === READ_STATUS.UNREAD &&
          b.readStatus !== READ_STATUS.UNREAD
        ) {
          return -1;
        }
        if (
          a.readStatus !== READ_STATUS.READ &&
          b.readStatus === READ_STATUS.READ
        ) {
          return 1;
        }
        return 0;
      })
      ?.sort(sortFn)
      ?.sort(sortByStatusFn);
  }, [filters, filteredData, renamedMaterialId, reclassifiedMaterialIds]);

  const currentPageParam = queryParams?.get('page');

  const {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    setNextPage,
    setPage,
    setPreviousPage
  } = usePager({
    totalItems: filteredSortedData?.length,
    initialPageSize: DEFAULT_RESULTS_PER_PAGE,
    initialPage: currentPageParam ? +currentPageParam - 1 : 0
  });

  const columns: Column<CaseMaterialsType>[] = [
    {
      key: 'subject',
      heading: 'Subject',
      render: (row) => (
        <>
          {hasAccess([2, 3, 4, 5]) && row.readStatus == READ_STATUS.UNREAD && (
            <StatusTag status="New" />
          )}
          <span className="subject-field">{row.subject}</span>
          {row.statusLabel && <StatusTag status={row.statusLabel} />}
        </>
      ),
      isSortable: true
    },
    { key: 'direction', heading: 'In/Out', isSortable: true },
    { key: 'party', heading: 'Comms with', isSortable: true },
    { key: 'method', heading: 'Comms Type', isSortable: true },
    { key: 'type', heading: 'Type', isSortable: true },
    {
      key: 'date',
      heading: 'Date',
      render: (row) => (
        <span aria-label={row.date === null ? 'No date available' : undefined}>
          {formatDate(row.date)}
        </span>
      ),
      isSortable: true
    }
  ];

  const expandableRow = (row: CaseMaterialsType) => (
    <DocumentPreview row={row} />
  );

  const recordsOnCurrentPage = endIndex + 1 - startIndex;

  useEffect(() => {
    setPage(0);
  }, [filters, renamedMaterialId, reclassifiedMaterialIds, setPage]);

  if (caseMaterialsLoading) {
    return <LoadingSpinner textContent="Loading materials..." />;
  }

  return (
    <>
      <p className="govuk-body showing-materials-count">
        Showing{' '}
        <strong>
          {filteredSortedData?.length === 0 ? 0 : recordsOnCurrentPage}
        </strong>{' '}
        {filteredSortedData?.length === 1 ? `communication` : `communications`}{' '}
        out of <strong>{filteredSortedData?.length}</strong>
      </p>
      <SortableTable
        data={(filteredSortedData || []).slice(startIndex, endIndex + 1)}
        dataName="communications"
        caption="Communications list view"
        filters={filters}
        columns={columns}
        expandableRow={expandableRow}
        error={error}
        isCommunications
      />
      <div
        className={
          totalPages > 1 ? 'table-actions-footer' : 'table-actions-footer-end'
        }
      >
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setNextPage={setNextPage}
          setPreviousPage={setPreviousPage}
          setPage={setPage}
        />
      </div>
    </>
  );
};
