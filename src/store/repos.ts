import { RepoType } from '@/utils/constants';
import type { Github } from '@/utils/github';
import { create } from 'zustand';

export type Repos = Required<
  Awaited<ReturnType<(typeof Github)['listRepos']>>
>['data'];

export type Repo = Repos[number];

export interface UseReposStore {
  repos: Record<string, Repos>;
  setRepos: (repos: Record<string, Repos>) => void;

  filters: {
    type: RepoType;
    page: number;
    maxPerPage: number;
  };
  resetFilters: () => void;
  setFilter: <T extends keyof UseReposStore['filters']>(
    filer: T,
    value: UseReposStore['filters'][T]
  ) => void;

  addRepos: (username: string, repos: Repos | Repo) => void;
  removeRepos: (username: string) => void;
}

export const useReposStore = create<UseReposStore>((set) => ({
  repos: {},
  setRepos: (repos) => {
    set({ repos });
  },

  filters: {
    type: RepoType.ALL,
    page: 1,
    maxPerPage: 10,
  },
  resetFilters() {
    set((prev) => ({
      ...prev,
      filters: {
        type: RepoType.ALL,
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

  addRepos: (username, repos) => {
    set((prev) => {
      const prevRepos = prev.repos[username] || [];
      const newRepos = Array.isArray(repos) ? repos : [repos];

      return {
        ...prev,
        repos: {
          ...prev.repos,
          [username]: [...prevRepos, ...newRepos],
        },
      };
    });
  },
  removeRepos: (username) => {
    set((prev) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [username]: _, ...repos } = prev.repos;

      return {
        ...prev,
        repos: repos,
      };
    });
  },
}));
