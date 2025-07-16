import { create } from 'zustand';

export interface UseGlobalStore {
  isSearching: boolean;
  setIsSearching: (isSearching: boolean | ((prev: boolean) => boolean)) => void;

  isInspecting: boolean;
  setIsInspecting: (
    isInspecting: boolean | ((prev: boolean) => boolean)
  ) => void;

  inspecting: string;
  setInspecting: (inspecting: string | ((prev: string) => string)) => void;

  isFetching: boolean;
  setIsFetching: (isFetching: boolean | ((prev: boolean) => boolean)) => void;

  isError: boolean;
  setIsError: (isError: boolean | ((prev: boolean) => boolean)) => void;

  error: string;
  setError: (error: string | ((prev: string) => string)) => void;

  isFilterOpen: boolean;
  toggleFilter: () => void;
  openFilter: () => void;
  closeFilter: () => void;
}

export const useGlobalStore = create<UseGlobalStore>((set) => ({
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

  isInspecting: false,
  setIsInspecting(isInspecting: boolean | ((prev: boolean) => boolean)) {
    set((prev) => ({
      ...prev,
      isInspecting:
        typeof isInspecting === 'function'
          ? isInspecting(prev.isInspecting)
          : isInspecting,
    }));
  },

  inspecting: '',
  setInspecting(inspecting: string | ((prev: string) => string)) {
    set((prev) => ({
      ...prev,
      inspecting:
        typeof inspecting === 'function'
          ? inspecting(prev.inspecting)
          : inspecting,
    }));
  },

  isFetching: false,
  setIsFetching(isFetching: boolean | ((prev: boolean) => boolean)) {
    set((prev) => ({
      ...prev,
      isFetching:
        typeof isFetching === 'function'
          ? isFetching(prev.isFetching)
          : isFetching,
    }));
  },

  isError: false,
  setIsError(isError: boolean | ((prev: boolean) => boolean)) {
    set((prev) => ({
      ...prev,
      isError: typeof isError === 'function' ? isError(prev.isError) : isError,
    }));
  },

  error: '',
  setError(error: string | ((prev: string) => string)) {
    set((prev) => ({
      ...prev,
      error: typeof error === 'function' ? error(prev.error) : error,
    }));
  },

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
}));
