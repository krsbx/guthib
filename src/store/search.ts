import { OrderBy, SortBy } from '@/utils/constants';
import { create } from 'zustand';

export interface UseSearchStore {
  isFilterOpen: boolean;
  toggleFilter: () => void;
  openFilter: () => void;
  closeFilter: () => void;

  filters: {
    sortBy: SortBy;
    orderBy: OrderBy;
    page: number;
    maxPerPage: number;
  };
  resetFilters: () => void;
  setFilter: <T extends keyof UseSearchStore['filters']>(
    filer: T,
    value: UseSearchStore['filters'][T]
  ) => void;

  isSearching: boolean;
  setIsSearching: (isSearching: boolean | ((prev: boolean) => boolean)) => void;
}

export const useSearchStore = create<UseSearchStore>((set) => ({
  isFilterOpen: false,
  toggleFilter() {
    set((prev) => ({
      ...prev,
      isFilterOpen: !prev.isFilterOpen,
    }));
  },
  openFilter() {
    set((prev) => ({
      ...prev,
      isFilterOpen: true,
    }));
  },
  closeFilter() {
    set((prev) => ({
      ...prev,
      isFilterOpen: false,
    }));
  },

  filters: {
    sortBy: SortBy.BEST_MATCH,
    orderBy: OrderBy.DESC,
    page: 1,
    maxPerPage: 10,
  },
  resetFilters() {
    set((prev) => ({
      ...prev,
      filters: {
        sortBy: SortBy.BEST_MATCH,
        orderBy: OrderBy.DESC,
        page: 1,
        maxPerPage: 10,
      },
    }));
  },
  setFilter(filer, value) {
    set((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        [filer]: value,
      },
    }));
  },

  isSearching: false,
  setIsSearching(isSearching: boolean | ((prev: boolean) => boolean)) {
    set((prev) => ({
      ...prev,
      isSearching:
        typeof isSearching === 'function'
          ? isSearching(prev.isSearching)
          : isSearching,
    }));
  },
}));
