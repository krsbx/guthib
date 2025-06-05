import { OrderBy, SortBy } from '@/utils/constants';
import type { Github } from '@/utils/github';
import { create } from 'zustand';

type Users = Required<
  Awaited<ReturnType<typeof Github.findUsers>>
>['data']['items'];

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
  isSearchError: boolean;
  setIsSearchError: (
    isSearchError: boolean | ((prev: boolean) => boolean)
  ) => void;

  searchError: string;
  setSearchError: (searchError: string | ((prev: string) => string)) => void;

  users: Users;
  setUsers: (users: Users) => void;
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

  isSearchError: false,
  setIsSearchError(isSearchError: boolean | ((prev: boolean) => boolean)) {
    set((prev) => ({
      ...prev,
      isSearchError:
        typeof isSearchError === 'function'
          ? isSearchError(prev.isSearchError)
          : isSearchError,
    }));
  },

  searchError: '',
  setSearchError(searchError: string | ((prev: string) => string)) {
    set((prev) => ({
      ...prev,
      searchError:
        typeof searchError === 'function'
          ? searchError(prev.searchError)
          : searchError,
    }));
  },

  users: [],
  setUsers(users) {
    set((prev) => ({
      ...prev,
      users,
    }));
  },
}));
