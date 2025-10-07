import { useContext, useEffect, useState } from 'react';

import { FilterContext } from '../context/FiltersContext';
import type {
  FilterItem,
  FilterKeys
} from '../context/FiltersContext/helpers/types';
import {
  getDefaultState,
  setFilter as setFilterState,
  setSort as setSortState
} from '../context/FiltersContext/helpers/utils';

export const useFilters = (
  filterSetName: FilterKeys,
  defaultState?: FilterItem
) => {
  const [shallowFilters, setShallowFilters] = useState<FilterItem>(
    getDefaultState(defaultState)
  );
  const {
    createFilterContext,
    filters,
    resetFilterContext,
    updateFilterContext
  } = useContext(FilterContext);

  const setSort = (column: string | null) => {
    const newSortDirection =
      !shallowFilters?.sort?.direction ||
      shallowFilters?.sort?.direction === 'descending'
        ? 'ascending'
        : 'descending';

    const hasSortColumnChanged = shallowFilters?.sort?.column !== column;

    const newSortState = {
      filters: (filters[filterSetName] as FilterItem).filters,
      // if someone clicks on a new sort column, we want to change to ascending no matter what
      sort: setSortState(
        column,
        hasSortColumnChanged ? 'ascending' : newSortDirection
      )
    };

    setShallowFilters(newSortState);
    // we want to update context immediately for sorting
    updateFilterContext(filterSetName, newSortState);
  };

  const setFilter = (filterGroup: string, name: string, value: boolean) => {
    setShallowFilters({
      ...shallowFilters,
      filters: setFilterState(shallowFilters.filters, filterGroup, name, value)
    });
  };

  const setCheckboxFilter = (
    filterGroup: string,
    name: string,
    checked: boolean
  ) => {
    setShallowFilters({
      ...shallowFilters,
      filters: setFilterState(
        shallowFilters.filters,
        filterGroup,
        name,
        checked
      )
    });
  };

  const setSearch = (query: string) => {
    setShallowFilters({ ...shallowFilters, search: query });
  };

  const saveFiltersToContext = () => {
    updateFilterContext(filterSetName, { ...shallowFilters });
  };

  const resetFilters = () => {
    setShallowFilters({
      ...shallowFilters,
      filters: defaultState?.filters || {},
      search: ''
    });
    resetFilterContext(filterSetName);
  };

  useEffect(() => {
    if (!filters[filterSetName]) {
      createFilterContext(filterSetName, defaultState);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [filters]);

  return {
    shallowFilters,
    filters: filters[filterSetName],
    resetFilters,
    saveFiltersToContext,
    setFilter,
    setCheckboxFilter,
    setSearch,
    setSort
  };
};
