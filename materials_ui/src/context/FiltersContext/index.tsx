import { createContext, PropsWithChildren, useState } from 'react';

import type {
  FilterItem,
  FilterKeys,
  FiltersContextState
} from './helpers/types';
import { getDefaultState } from './helpers/utils';

// DATA STRUCTURE
// {
//   materials: {
//     sort: { column: 'subject', direction: 'ascending' },
//     filters: { status: ['Unused', 'Used'] }
//   },
//   ...
// }

export type FiltersContext = {
  filters: FiltersContextState;
  createFilterContext: (
    filterSet: FilterKeys,
    defaultState?: FilterItem
  ) => void;
  updateFilterContext: (
    filterSet: FilterKeys,
    newFilterSet: FilterItem
  ) => void;
  resetFilterContext: (filterSet: FilterKeys) => void;
};

export const FilterContext = createContext<FiltersContext>({
  filters: { materials: {}, communications: {}, documents: {} },
  createFilterContext: () => null,
  updateFilterContext: () => null,
  resetFilterContext: () => null
});

export const FilterProvider = ({ children }: PropsWithChildren) => {
  const [filters, setFilters] = useState<FiltersContextState>(
    {} as FiltersContextState
  );

  const createFilterContext = (
    filterSet: string,
    defaultState?: FilterItem
  ) => {
    setFilters({ ...filters, [filterSet]: getDefaultState(defaultState) });
  };

  const updateFilterContext = (
    filterSet: FilterKeys,
    newFilterSet: FilterItem
  ) => {
    setFilters({
      ...filters,
      [filterSet]: {
        filters: { ...newFilterSet.filters },
        search: newFilterSet.search,
        sort: newFilterSet.sort
      }
    });
  };

  const resetFilterContext = (filterSet: FilterKeys) => {
    setFilters({
      ...filters,
      [filterSet]: { sort: filters[filterSet]?.sort, filters: {}, search: '' }
    });
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        createFilterContext,
        resetFilterContext,
        updateFilterContext
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
