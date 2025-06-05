import { create } from 'zustand';

export interface UseGlobalStore {
  isSearching: boolean;
  setIsSearching: (isSearching: boolean | ((prev: boolean) => boolean)) => void;

  isError: boolean;
  setIsError: (isError: boolean | ((prev: boolean) => boolean)) => void;

  error: string;
  setError: (error: string | ((prev: string) => string)) => void;
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
}));
