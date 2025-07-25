import { OrderBy, SortBy } from '@/utils/constants';
import type { Github } from '@/utils/github';
import { create } from 'zustand';

export type Users = Required<
  Awaited<ReturnType<typeof Github.findUsers>>
>['data']['items'];

export type User = Users[number];

export interface UseSearchStore {
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

  username: string;
  setUsername: (username: string | ((prev: string) => string)) => void;

  users: Users;
  setUsers: (users: Users) => void;
  addUser: (user: User | Users) => void;
}

export const useSearchStore = create<UseSearchStore>((set) => ({
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

  username: '',
  setUsername(username: string | ((prev: string) => string)) {
    set((prev) => ({
      ...prev,
      username:
        typeof username === 'function' ? username(prev.username) : username,
    }));
  },

  users: [],
  setUsers(users) {
    set((prev) => ({
      ...prev,
      users,
    }));
  },
  addUser(user) {
    const users = Array.isArray(user) ? user : [user];

    set((prev) => ({
      ...prev,
      users: [...prev.users, ...users],
    }));
  },
}));
