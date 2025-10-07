export type SortBy = 'ascending' | 'descending';

export type FilterKeys = 'materials' | 'communications';

export type FilterItem = {
  filters?: Record<string, string[]>;
  search?: string;
  sort?: { column: string | null; direction: SortBy | null };
};

export type FiltersContextState = Record<FilterKeys, FilterItem | undefined>;
